<template>
  <Dashboard>
    <div class="flex flex-col items-center justify-center gap-2 bg-grey-light w-auto py-32">
      <div class="w-[500px]">
        <div class="flex">
          <n-input placeholder="email" v-model:value="email" class="!w-[300px]"></n-input>
          <BasicButton class="ml-auto" @click="sendEmail">Send email</BasicButton>
        </div>

        <div class="flex mt-5">
          <n-input placeholder="code" v-model:value="code" class="!w-[300px]"></n-input>
          <BasicButton class="ml-auto" @click="logIn">Log In</BasicButton>
        </div>

        <div class="flex flex-col mt-12 items-center justify-center">
          <BasicButton size="large" @click="getWallet">Get wallet</BasicButton>
          <div class="mt-4">{{ wallet?.address }}</div>
        </div>

        <div class="flex flex-col mt-12 items-center justify-center">
          <BasicButton size="large" @click="sign">Sign</BasicButton>
          <div class="mt-4">{{ sig }}</div>
        </div>

        <div class="flex flex-col mt-12 items-center justify-center">
          <BasicButton size="large" @click="testBalance">Test Balance</BasicButton>
          <div class="mt-4">{{ balance }}</div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
const { saveWallet, saveWalletClient } = useUserStore();
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import Endpoints from '~/lib/values/endpoints';

const { getCollateralBalance, getSymbol } = useCollateralToken();
const userStore = useUserStore();

const email = ref('anze.mur@kalmia.si');
const code = ref('');
const wallet = ref();

const sig = ref('');
const balance = ref('');
const { privy } = usePrivy();

onMounted(async () => {});

async function sendEmail() {
  try {
    await privy.auth.email.sendCode(email.value);
  } catch (error) {
    console.log(error);
  }
}

async function logIn() {
  try {
    const session = await privy.auth.email.loginWithCode(email.value, code.value, 'login-or-sign-up', {
      embedded: { ethereum: { createOnLogin: 'all-users' } },
    });

    await getWallet();

    const resMessage = await $api.get<WalletMessageResponse>(Endpoints.walletMessage);
    const message = resMessage.data.message;
    const timestamp = resMessage.data.timestamp;

    const signature = await userStore.walletClient.signMessage({
      message,
      account: userStore.wallet.address as any,
    });

    const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, {
      address: userStore.wallet.address,
      signature,
      timestamp,
    });

    userStore.saveUser(res.data);

    console.log(session);
  } catch (error) {
    console.log(error);
  }
}

async function getWallet() {
  try {
    let user = (await privy.user.get()).user;

    const embedded = user?.linked_accounts.find(
      acc => acc.type === 'wallet' && acc.connector_type === 'embedded'
    ) as PrivyWallet;
    wallet.value = embedded;

    saveWallet(wallet.value);

    const provider = await privy.embeddedWallet.getProvider(wallet.value);
    const viemWalletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });

    saveWalletClient(viemWalletClient);

    console.log(wallet);
  } catch (error) {
    console.log(error);
  }
}

async function sign() {
  const provider = await privy.embeddedWallet.getProvider(wallet.value);

  const viemWalletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(provider),
    account: wallet.value.address,
  });

  // use viem to sign a message
  const signature = await viemWalletClient.signMessage({
    message: 'Hello from Privy!!',
    account: wallet.value.address,
  });

  sig.value = signature;

  console.log(signature);
}

async function testBalance() {
  const symbol = await getSymbol();
  console.log(symbol);
  const balance = await getCollateralBalance();
  console.log(balance);
}
</script>
