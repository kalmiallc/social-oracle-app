import Privy from '@privy-io/js-sdk-core';
import { createWalletClient, custom, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';

export const usePrivy = () => {
  const { saveWallet, saveWalletClient } = useUserStore();
  const { $privy } = useNuxtApp();
  const privy = $privy as Privy;

  /**
   * Checks if Privy is connected.
   * @returns Boolean.
   */
  async function isConnected(): Promise<boolean> {
    try {
      return !!(await privy.user.get())?.user?.id;
    } catch {
      return false;
    }
  }

  /**
   * Refreshes Privy data - wallet and wallet client.
   */
  async function refreshData() {
    try {
      let user = (await privy.user.get()).user;

      // Get embedded wallet.
      const wallet = user?.linked_accounts.find(
        acc => acc.type === 'wallet' && acc.connector_type === 'embedded'
      ) as PrivyWallet;

      saveWallet(wallet);

      // Create provider.
      const provider = await privy.embeddedWallet.getProvider(wallet as any);
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14A34' }],
      });

      privy.funding.coinbase.initOnRampSession;
      const viemWalletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(provider),
        account: wallet.address as Address,
      });

      saveWalletClient(viemWalletClient);
    } catch (error) {
      console.log(error);
    }
  }

  return { privy, isConnected, refreshData };
};
