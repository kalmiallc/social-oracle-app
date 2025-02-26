<template>
  <Dashboard :loading="loadingProfile">
    <slot>
      <FormWrapper class="mt-8" :title="'Account information'">
        <FormUserProfile />
      </FormWrapper>

      <FormWrapper class="mt-8" :title="'Connections'"> <FormUserGithub /></FormWrapper>

      <FormWrapper class="mt-8" :title="'GitHub bonuses'"><FormUserGithubBonus /> </FormWrapper>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { loadingProfile } = useUserStore();

useHead({
  title: t('profile.mySettings'),
});
</script>

<style scoped>
.highlight-row-1 tr:nth-child(1) td,
.highlight-row-2 tr:nth-child(2) td,
.highlight-row-3 tr:nth-child(3) td,
.highlight-row-4 tr:nth-child(4) td,
.highlight-row-5 tr:nth-child(5) td,
.highlight-row-6 tr:nth-child(6) td {
  background-color: #8a3a8d;
}
</style>
