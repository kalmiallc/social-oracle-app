<template>
  <div class="h-screen">
    <Spinner :size="48"></Spinner>
  </div>
</template>

<script setup lang="ts">
import Endpoints from '~/lib/values/endpoints';

const { privy, refreshData } = usePrivy();
const userStore = useUserStore();
const message = useMessage();
const router = useRouter();
const { refreshCollateralBalance } = useCollateralToken();

onMounted(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const oauthCode = queryParams.get('privy_oauth_code');
  const oauthState = queryParams.get('privy_oauth_state');
  if (oauthCode && oauthState) {
    try {
      const session = await privy.auth.oauth.loginWithCode(oauthCode, oauthState, 'github', 'raw', 'login-or-sign-up', {
        embedded: { ethereum: { createOnLogin: 'users-without-wallets' } },
      });

      const github = session?.user?.linked_accounts?.find(acc => acc.type === 'github_oauth') as PrivyGitHub;

      if (!userStore.loggedIn) {
        await refreshData();
        const resMessage = await $api.get<WalletMessageResponse>(Endpoints.walletMessage);
        const signingMessage = resMessage.data.message;
        const timestamp = resMessage.data.timestamp;

        const signature = await userStore.walletClient.signMessage({
          message: signingMessage,
          account: userStore.wallet.address as any,
        });

        const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, {
          address: userStore.wallet.address,
          signature,
          timestamp,
        });

        userStore.saveUser(res.data);
        userStore.setConnected(true);
        await userStore.linkGithub(github);

        try {
          await refreshCollateralBalance();
        } catch (error) {
          console.log(error);
        }
        message.success('Log in successful.');
      } else {
        await userStore.linkGithub(github);
        message.success('Link successful.');
      }
    } catch (error: any) {
      if (typeof error?.error === 'string') {
        message.error(error?.error);
      } else {
        message.error('Error linking github. Please try again later.');
      }
      console.error(error);
    }
  } else {
    message.error('Error linking github. Please try again later.');
  }
  if (userStore.loggedIn) {
    router.push('/profile');
    return;
  } else {
    router.push('/');
    return;
  }
});
</script>
