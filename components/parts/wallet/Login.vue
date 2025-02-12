<template>
  <BasicButton class="py-[17px] px-[16px]" v-bind="$attrs" @click="btnAction()" size="large">
    <span v-if="address">
      Disconnect
      <small>({{ truncateWallet(address) }})</small>
    </span>
    <span v-else class="font-bold text-[14px] leading-[20px]">Log In</span>
  </BasicButton>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" class="w-auto" :title="$t('wallet.info')">
    <WalletEvm :loading="loadingWallet" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect, useDisconnect, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import Endpoints from '~/lib/values/endpoints';
import { truncateWallet } from '~/lib/misc/strings';
import BasicButton from '~/components/general/BasicButton.vue';

const { t } = useI18n();
const { $wagmiConfig } = useNuxtApp();
const { error, success } = useMessage();
const userStore = useUserStore();
const { resetContracts, ensureCorrectNetwork } = useContracts();

/** Evm wallet - wagmi */
const { disconnect } = useDisconnect();
const { address, isConnected } = useAccount();

useAccountEffect({
  onConnect: data => evmWalletLogin(data),
});

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

onBeforeMount(() => {
  // if (!isConnected.value) {
  //   try {
  //     assetStore.$reset();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  if (!userStore.loggedIn) {
    disconnect();
    resetContracts();
  }
});

watch(
  () => address.value,
  address => {
    if (address && !userStore.loggedIn) {
      evmWalletLogin({});
    } else if (address) {
      modalWalletSelectVisible.value = false;
    }
  }
);

function btnAction() {
  if (address.value) {
    disconnect();
    resetContracts();
  } else {
    modalWalletSelectVisible.value = true;
  }
}

/** Login with EVM wallet */
async function evmWalletLogin(data: Record<string, any>) {
  await sleep(200);

  if (!address) {
    error(t('wallet.login.walletAccountNotConnected'));
    return;
  } else if (loadingWallet.value) {
    return;
  }

  loadingWallet.value = true;

  try {
    await ensureCorrectNetwork();
  } catch (error) {
    console.log('Error while switching network: ');
    console.log(error);
  }

  try {
    const resMessage = await $api.get<WalletMessageResponse>(Endpoints.walletMessage);
    const message = resMessage.data.message;
    const timestamp = resMessage.data.timestamp;
    const signature = await signMessage($wagmiConfig as Config, { message });

    const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, {
      address: data?.address || address.value,
      signature,
      timestamp,
    });

    userStore.saveUser(res.data);

    /** Show success message */
    success(t('wallet.login.success'));
  } catch (e) {
    // TODO: handle canceled signature.

    console.error(e);
    error(apiError(e));
    disconnect();
  }
  loadingWallet.value = false;
}
</script>
