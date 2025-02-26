<template>
  <n-form ref="formRef" class="w-full max-w-lg">
    <n-form-item :label="'GitHub'">
      <n-input
        v-model:value="github"
        :input-props="{ id: 'username' }"
        :placeholder="'Connect GitHub'"
        :readonly="true"
        :loading="loading"
      />
      <BasicButton v-if="!github && !loading" class="ml-4" btnClass="h-[40px]" @click="linkGithub">
        <NuxtIcon name="icon/github" class="text-[20px] pt-1"
      /></BasicButton>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const { privy, connectGithub } = usePrivy();

const github = ref('');
const loading = ref(true);

onMounted(async () => {
  await sleep(500);

  const user = (await privy.user.get()).user;

  const userGithub = user?.linked_accounts.find(acc => acc.type === 'github_oauth');
  if (userGithub?.username) {
    github.value = userGithub.username;
  }

  loading.value = false;
});

async function linkGithub() {
  await connectGithub();
}
</script>
