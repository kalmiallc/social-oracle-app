<template>
  <BasicButton class="py-[17px] px-[16px]" v-bind="$attrs" @click="showLoginForm = true" size="large">
    <span class="font-bold text-[14px] leading-[20px]">Log In</span>
  </BasicButton>

  <modal v-model:show="showLoginForm" class="w-[320px] border-none" :mask-closable="!loading">
    <LoginForm @loading="val => (loading = val)" @success="showLoginForm = false"></LoginForm>
  </modal>
</template>

<script lang="ts" setup>
import BasicButton from '~/components/general/BasicButton.vue';

const loading = ref(false);
const showLoginForm = ref<boolean>(false);
</script>
