import { newtonRaphson } from '@fvictorio/newton-raphson-method';
import Big from 'big.js';
import { parseEther, type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

/**
 * Use Fixed Market Maker (FMM) Contract.
 */
export default function useFixedMarketMaker() {
  const { checkCollateralAllowance, getTokenStore, loadToken } = useCollateralToken();
  const { checkConditionalApprove } = useConditionalToken();
  const { initContract } = useContracts();
  const tokenStore = getTokenStore();
  const userStore = useUserStore();

  /**
   * Parses collateral token balance.
   *
   * @param fixed TO how many decimal points should the balance be parsed.
   * @returns Parsed balance.
   */
  async function getMarketFee(fpmmContractAddress: Address) {
    const oracle = await initContract(ContractType.ORACLE);
    const fpmmContract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const userFee = await oracle.read.userFee([userStore.wallet.address]);
    const fee = await fpmmContract.read.fee();

    return { userFee, fee };
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function getMaxTokensToSell(
    fpmmContractAddress: Address,
    collateralAmount: bigint,
    outcomeIndex: number,
    slippage: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const expectedShares = await contract.read.calcSellAmount([
      collateralAmount,
      outcomeIndex,
      userStore.wallet.address,
    ]);
    const maxOutcomeTokensToSell = (expectedShares * BigInt(100 + slippage)) / BigInt(100);

    return maxOutcomeTokensToSell;
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function getMinTokensToBuy(
    fpmmContractAddress: Address,
    amount: number,
    outcomeIndex: number,
    slippage: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));
    const expectedShares = await contract.read.calcBuyAmount([scaledAmount, outcomeIndex, userStore.wallet.address]);
    const minOutcomeTokensToBuy = (expectedShares * BigInt(100 - slippage)) / BigInt(100);

    return minOutcomeTokensToBuy;
  }

  /**
   * Buys outcome tokens for the given market.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Buy amount in collateral token.
   * @param outcomeIndex Outcome index to buy.
   * @param slippage Slippage percentage.
   * @returns Buy TX.
   */
  async function buy(fpmmContractAddress: Address, amount: number, outcomeIndex: number, slippage: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const allowance = await checkCollateralAllowance(fpmmContractAddress);
    if (allowance) {
      const minOutcomeTokensToBuy = await getMinTokensToBuy(fpmmContractAddress, amount, outcomeIndex, slippage);
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));

      return await contract.write.buy([scaledAmount, outcomeIndex, minOutcomeTokensToBuy]);
    }
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function sell(fpmmContractAddress: Address, collateralAmount: bigint, outcomeIndex: number, slippage: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const approved = await checkConditionalApprove(fpmmContractAddress);
    if (approved) {
      const maxOutcomeTokensToSell = await getMaxTokensToSell(
        fpmmContractAddress,
        collateralAmount,
        outcomeIndex,
        slippage
      );

      return await contract.write.sell([collateralAmount, outcomeIndex, maxOutcomeTokensToSell]);
    }
  }

  /**
   * Returns user's funding balance - LP tokens.
   * @param fpmmContractAddress FPMM contract address.
   * @returns Funding balance.
   */
  async function getFundingBalance(fpmmContractAddress: Address) {
    if (!userStore.wallet.address) {
      return;
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    return await contract.read.balanceOf([userStore.wallet.address]);
  }

  /**
   * Adds funding to selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Funding amount in collateral token.
   */
  async function addFunding(fpmmContractAddress: Address, amount: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const allowance = await checkCollateralAllowance(fpmmContractAddress);
    if (allowance) {
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));
      return await contract.write.addFunding([scaledAmount, []]);
    }
  }

  /**
   * Removes funding from the selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param shareAmount Amount of shares to return.
   */
  async function removeFunding(fpmmContractAddress: Address, shareAmount: bigint) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    return await contract.write.removeFunding([Number(shareAmount)]);
  }

  /**
   *
   * @param sharesAmount
   * @param outcomeIndex
   * @param fpmmContractAddress
   * @param positionIds
   * @returns
   */
  async function calcSellAmountInCollateral(
    sharesAmount: number,
    outcomeIndex: number,
    fpmmContractAddress: Address,
    positionIds: string[]
  ) {
    Big.DP = 90;

    const ctContract = await initContract(ContractType.CONDITIONAL_TOKEN);
    const owners = positionIds.map(() => fpmmContractAddress);
    const ids = positionIds.map(positionId => BigInt(positionId));
    const marketSharesAmounts = await ctContract.read.balanceOfBatch([owners, ids]);

    const oracle = await initContract(ContractType.ORACLE);
    const userFee = await oracle.read.userFee([userStore.wallet.address]);

    let userFeeDecimal = null;
    if (userFee === BigInt(0)) {
      const fpmmContract = await initContract(ContractType.FPMM, fpmmContractAddress);
      const fee = await fpmmContract.read.fee();
      const feeBN = new Big(fee.toString());
      userFeeDecimal = feeBN.div(parseEther('1').toString());
    } else {
      const userFeeBN = new Big(userFee.toString());
      userFeeDecimal = userFeeBN.div(parseEther('1').toString());
    }

    const marketSellingSharesAmounts = new Big(marketSharesAmounts[outcomeIndex]);
    const marketNonSellingSharesAmounts = marketSharesAmounts
      .filter((_, index) => index !== outcomeIndex)
      .map(marketShares => new Big(marketShares));
    const sharesToSell = new Big(Math.round(sharesAmount * 10 ** tokenStore.decimals));

    const f = r => {
      /* For three outcomes, where the `x` is the one being sold, the formula is:
       * f(r) = ((y - R) * (z - R)) * (x  + a - R) - (x * y * z)
       * where:
       *   `R` is r / (1 - fee)
       *   `x`, `y`, `z` are the market maker shares for each outcome, where `x` is the market maker share being sold
       *   `a` is the amount of outcomes shares that are being sold
       *   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
       */

      const R = r.div(new Big(1).minus(userFeeDecimal)); // Adjust for fee

      // const R = r.div(1 - userFee);

      // ((y - R) * (z - R))
      const firstTerm = marketNonSellingSharesAmounts.map(h => h.minus(R)).reduce((a, b) => a.mul(b));

      // (x  + a - R)
      const secondTerm = marketSellingSharesAmounts.plus(sharesToSell).minus(R);

      // (x * y * z)
      const thirdTerm = marketNonSellingSharesAmounts.reduce((a, b) => a.mul(b), marketSellingSharesAmounts);

      // ((y - R) * (z - R)) * (x  + a - R) - (x * y * z)
      return firstTerm.mul(secondTerm).minus(thirdTerm);
    };

    /* Newton-Raphson method is used to find the root of a function.
     * Root of a function is the point where the function touches the x-axis on a graph.
     * In this case y-axis is the number of outcome tokens / shares.
     * The x-axis is the number of colleral tokens to be received.
     * This meaning we want to know how much collateral we need to receive to have 0 outcome tokens / shares.
     */
    const r = newtonRaphson(f, 0, { maxIterations: 100 });

    if (!r) {
      return null;
    }

    return BigInt(r.toFixed(0)) as any;
  }

  return {
    getMaxTokensToSell,
    getMinTokensToBuy,
    addFunding,
    buy,
    sell,
    getFundingBalance,
    removeFunding,
    calcSellAmountInCollateral,
    getMarketFee,
  };
}
