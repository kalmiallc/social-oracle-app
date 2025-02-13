<template>
  <Dashboard :loading="userStore.loadingProfile">
    <slot>
      <FormWrapper class="mt-8" :title="'Account information'">
        <FormUserProfile />
      </FormWrapper>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const userStore = useUserStore();

useHead({
  title: t('profile.mySettings'),
});
</script>
