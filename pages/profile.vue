<template>
  <Dashboard :loading="userStore.loadingProfile">
    <slot>
      <FormWrapper class="mt-8" :title="'Account information'">
        <FormUserProfile />
      </FormWrapper>
      <!-- 
      <FormWrapper :title="'Email'">
        <n-h5>{{ $t('profile.email.changeRequest') }}</n-h5>
        <FormUserEmail />
      </FormWrapper> -->
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const userStore = useUserStore();

useHead({
  title: t('profile.mySettings'),
});

onMounted(async () => {});

/** Modal Change password */
const showModalChangePassword = ref(false);

/** Close modal after password has been changed */
function passwordChanged() {
  setTimeout(() => {
    showModalChangePassword.value = false;
  }, 2000);
}
</script>
