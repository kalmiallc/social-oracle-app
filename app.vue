<template>
  <div id="app" class="bg-bg">
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
      <n-message-provider placement="bottom-right" :keep-alive-on-hover="true" :duration="3000" closable>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>
      <!-- <CookieConsent /> -->
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect } from '@wagmi/vue';
import { darkTheme, enUS, dateEnUS } from 'naive-ui';
import { themeOverrides } from './lib/config/naive-ui';

const userStore = useUserStore();
const { isConnected, isConnecting, isReconnecting } = useAccount();
const { connectors, connect } = useConnect();

const $i18n = useI18n();
window.$i18n = $i18n;

const lang = computed(() => {
  return $i18n.locale.value;
});
const locale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return enUS;
    default:
      return enUS;
  }
});
const dateLocale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return dateEnUS;
    default:
      return dateEnUS;
  }
});

useHead({
  htmlAttrs: {
    lang,
  },
});

watch(
  () => userStore.loggedIn,
  _ => {
    if (!isConnected.value && !isConnecting.value && !isReconnecting.value && connectors.length) {
      connect({ connector: connectors[0] });
    }
  },
  { immediate: true }
);
</script>
