<template>
  <n-form ref="formRef" class="w-full max-w-lg">
    <n-form-item :label="'Wallet'">
      <n-input
        v-model:value="userStore.wallet.address"
        :input-props="{ id: 'wallet' }"
        :placeholder="'Wallet'"
        :readonly="true"
        :loading="loading"
      />
    </n-form-item>

    <n-form-item path="email" :label="'Email address'">
      <n-input
        v-model:value="email"
        :input-props="{ id: 'email', type: 'email' }"
        :readonly="true"
        :loading="loading"
      />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const { privy } = usePrivy();

const email = ref('');
const loading = ref(true);

onMounted(async () => {
  await sleep(500);

  const user = (await privy.user.get()).user;
  console.log(user);

  const userEmail = user?.linked_accounts.find(acc => acc.type === 'email');
  if (userEmail) {
    email.value = userEmail.address;
  }

  loading.value = false;
});
</script>
