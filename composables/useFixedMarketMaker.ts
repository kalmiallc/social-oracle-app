import { useAccount } from '@wagmi/vue';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

/**
 * Use Fixed Market Maker (FMM) Contract.
 */
export default function useFixedMarketMaker() {
  const { checkCollateralAllowance, getTokenStore, loadToken } = useCollateralToken();
  const { checkConditionalApprove } = useConditionalToken();
  const { initContract } = useContracts();
  const { address } = useAccount();
  const tokenStore = getTokenStore();

  /**
   *
   * @param fpmmContractAddress
   * @param outcomeIndex
   * @returns
   */
  async function getPricePerShare(fpmmContractAddress: Address, outcomeIndex: number) {
    const amount = BigInt(Math.round(1 * 10 ** tokenStore.decimals));

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const expectedShares = await contract.read.calcBuyAmount([amount, outcomeIndex]);

    return amount / expectedShares;
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
    amount: number,
    outcomeIndex: number,
    slippage: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const sellAmount = await contract.read.calcSellAmount([amount, outcomeIndex]);
    const maxOutcomeTokensToSell = sellAmount * (BigInt(100 - slippage) / BigInt(100));

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
    const expectedShares = await contract.read.calcBuyAmount([scaledAmount, outcomeIndex]);
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
  async function sell(
    fpmmContractAddress: Address,
    sharesAmount: number,
    outcomeIndex: number,
    slippage: number,
    price: number // TODO: Obtain price from contract.
  ) {
    if (!tokenStore.loaded) {
      await loadToken();
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const approved = await checkConditionalApprove(fpmmContractAddress);
    if (approved) {
      const collateralAmount = sharesAmount * price;
      const scaledAmount = BigInt(Math.round(collateralAmount * 10 ** tokenStore.decimals));

      const minOutcomeTokensToBuy = await getMinTokensToBuy(
        fpmmContractAddress,
        collateralAmount,
        outcomeIndex,
        slippage
      );

      return await contract.write.sell([scaledAmount, outcomeIndex, minOutcomeTokensToBuy]);
    }
  }

  /**
   * Returns user's funding balance - LP tokens.
   * @param fpmmContractAddress FPMM contract address.
   * @returns Funding balance.
   */
  async function getFundingBalance(fpmmContractAddress: Address) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    return await contract.read.balanceOf([address.value]);
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

  return {
    getMaxTokensToSell,
    getMinTokensToBuy,
    addFunding,
    buy,
    sell,
    getPricePerShare,
    getFundingBalance,
    removeFunding,
  };
}
