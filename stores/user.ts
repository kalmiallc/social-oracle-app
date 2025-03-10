import { defineStore } from 'pinia';
import type { WalletClient } from 'viem';
import Endpoints from '~/lib/values/endpoints';
import { PARAMS_ALL_ITEMS, WebStorageKeys } from '~/lib/values/general.values';

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: '',
    loadingProfile: false,
    notifications: {
      loading: false,
      items: [] as NotificationInterface[],
    },
    promises: {
      profile: null as any,
    },
    collateralToken: {
      balance: BigInt(0),
      parsedBalance: '0.0',
      decimals: 0,
      symbol: '',
      loaded: false,
      loading: false,
    },
    user: {} as UserInterface,
    wallet: {} as PrivyWallet,
    walletClient: {} as WalletClient,
    isConnected: false,
  }),
  getters: {
    loggedIn(state) {
      return !!state.jwt;
    },
    hasNotifications(state) {
      return Array.isArray(state.notifications.items) && state.notifications.items.length > 0;
    },
  },
  actions: {
    async logout() {
      const { logout } = usePrivy();
      try {
        this.$reset();
        $api.clearToken();
        // Logout from Privy
        await logout();
        // TODO: Disconnect client
      } catch (e) {}
    },

    saveUser(userData: AuthInterface) {
      this.user = { ...userData };

      if (userData.token) {
        this.setUserToken(userData.token);
      }
    },

    saveWallet(walletData: PrivyWallet) {
      this.wallet = walletData;
    },

    setConnected(connected: boolean) {
      this.isConnected = connected;
    },

    saveWalletClient(client: WalletClient) {
      this.walletClient = client;
    },

    setUserToken(token: string) {
      this.jwt = token;
      $api.setToken(token);
    },

    /**
     * API calls
     */
    async initUser() {
      if (this.jwt) {
        this.setUserToken(this.jwt);
        this.promises.profile = this.getUserData();
      } else {
        this.logout();
      }
    },

    async getUserData() {
      this.loadingProfile = true;
      try {
        const res = await $api.get<UserResponse>(Endpoints.me);

        if (res.data) {
          this.saveUser(res.data);
        }
        setTimeout(() => {
          this.loadingProfile = false;
        }, 10);

        return res;
      } catch (error) {
        /** On error - logout */
        this.logout();

        setTimeout(() => {
          this.loadingProfile = false;
        }, 700);
        return null;
      }
    },

    /** Notifications */
    async getNotifications(force = false) {
      if (this.hasNotifications || !force) return;

      this.notifications.loading = true;
      try {
        const params = parseArguments({ limit: PARAMS_ALL_ITEMS.limit });
        const { data } = await $api.get<NotificationsResponse>(Endpoints.notification, params);
        this.notifications.items = data.items;
      } catch (error: any) {
        this.notifications.items = [] as NotificationInterface[];

        /** Show error message */
        window.$message.error(apiError(error));
      } finally {
        this.notifications.loading = false;
      }
    },

    async linkGithub(github: PrivyGitHub) {
      if (this.user.githubId !== +github.subject || this.user.githubUsername !== github.username) {
        try {
          const res = await $api.put<GitHubLinkResponse>(Endpoints.githubLink, {
            id: github.subject,
            username: github.username,
          });
          if (res.data) {
            this.saveUser(res.data);
          }
        } catch (error: any) {
          console.log(error);
        }
      }
    },
  },
  persist: {
    key: WebStorageKeys.USER_STORE,
    storage: sessionStorage,
    pick: ['jwt', 'notifications', 'user'],
  },
});
