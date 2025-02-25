import Privy from '@privy-io/js-sdk-core';
import { createWalletClient, custom, type Address } from 'viem';
import { removeLastSlash } from '~/lib/misc/strings';

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

      const chain = getChain();
      const chainIdHex = `0x${chain.id.toString(16).toUpperCase()}`;

      // Create provider.
      const provider = await privy.embeddedWallet.getProvider(wallet as any);

      // Switch chain.
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      const viemWalletClient = createWalletClient({
        chain: chain,
        transport: custom(provider),
        account: wallet.address as Address,
      });

      saveWalletClient(viemWalletClient);
    } catch (error) {
      console.log(error);
    }
  }

  async function connectGithub() {
    const config = useRuntimeConfig();
    try {
      const { url } = await privy.auth.oauth.generateURL(
        'github',
        removeLastSlash(getAppConfig(config.public.ENV).url) + '/github-login'
      );
      console.log(url);
      window.location.assign(encodeURI(url));
    } catch (error) {
      console.error(error);
    }
  }

  // Logout from Privy. We need to manually delete cookies for it to work.
  async function logout() {
    if (await isConnected()) {
      await privy.auth.logout();
    }
    deleteCookies();
  }

  function deleteCookies() {
    const cookies = ['privy-token', 'privy-session', 'privy-refresh-token', 'privy-id-token'];
    for (const cookie of cookies) {
      document.cookie = cookie + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  return { privy, isConnected, refreshData, connectGithub, logout };
};
