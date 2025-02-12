import { maxUint256, type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useCollateralToken() {
  const { initContract } = useContracts();
  const txWait = useTxWait();
  const message = useMessage();
  const userStore = useUserStore();

  /**
   * Checks collateral token balance and increases it if it is not sufficient.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @returns Boolean.
   */
  async function checkCollateralAllowance(fpmmContractAddress: Address): Promise<boolean> {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    try {
      const allowance = await contract.read.allowance([userStore.wallet.address, fpmmContractAddress]);
      if (allowance < maxUint256) {
        txWait.hash.value = await contract.write.approve([fpmmContractAddress, maxUint256]);
        const receipt = await txWait.wait();
        console.debug(receipt);
      }

      return true;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));
      return false;
    }
  }

  /**
   * Get collateral token balance.
   *
   * @returns Collateral token balance.
   */
  async function getCollateralBalance() {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);
    return await contract.read.balanceOf([userStore.wallet.address]);
  }

  /**
   * Get collateral token symbol.
   *
   * @returns Collateral token symbol.
   */
  async function getSymbol(): Promise<string> {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    return await contract.read.symbol([]);
  }

  /**
   * Get collateral token decimals.
   *
   * @returns Collateral token decimals.
   */
  async function getDecimals(): Promise<number> {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    return await contract.read.decimals([]);
  }

  /**
   * Parses collateral token balance.
   *
   * @param fixed TO how many decimal points should the balance be parsed.
   * @returns Parsed balance.
   */
  function parseBalance(fixed: number = 3) {
    const tokenStore = getTokenStore();

    const balance = Number(tokenStore.balance) / Math.pow(10, tokenStore.decimals);
    return balance.toFixed(fixed);
  }

  /**
   * Loads collateral token.
   */
  async function loadToken() {
    const tokenStore = getTokenStore();
    try {
      tokenStore.loading = true;
      tokenStore.balance = await getCollateralBalance();
      tokenStore.decimals = await getDecimals();
      tokenStore.symbol = await getSymbol();
      tokenStore.parsedBalance = parseBalance();
      tokenStore.loaded = true;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));

      tokenStore.balance = BigInt(0);
      tokenStore.parsedBalance = '0.0';
      tokenStore.decimals = 0;
      tokenStore.symbol = '';
      tokenStore.loaded = false;
    } finally {
      tokenStore.loading = false;
    }
  }

  /**
   * Refreshes collateral token.
   */
  async function refreshCollateralBalance() {
    const tokenStore = getTokenStore();

    if (!tokenStore.loaded) {
      await loadToken();
    } else {
      tokenStore.loading = true;
      tokenStore.balance = await getCollateralBalance();
      tokenStore.parsedBalance = parseBalance();
      tokenStore.loading = false;
    }
  }

  /**
   * Returns collateral token store.
   *
   * @returns Collateral token store.
   */
  function getTokenStore() {
    return userStore.collateralToken;
  }

  return {
    getTokenStore,
    checkCollateralAllowance,
    getCollateralBalance,
    getSymbol,
    refreshCollateralBalance,
    loadToken,
    parseBalance,
  };
}
