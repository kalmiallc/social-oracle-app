<template>
  <n-dropdown
    v-if="userStore.loggedIn"
    class="rounded-lg"
    placement="bottom-end"
    size="large"
    :options="options"
    style="min-width: 220px"
    @select="handleSelect"
    v-model:show="isOpened"
  >
    <div class="flex items-center bg-grey-light py-2 px-[6px] cursor-pointer rounded-lg">
      <jazzicon
        class="cursor-pointer rounded-[50%] w-[40px] h-[40px]"
        :address="userStore?.wallet?.address"
        :diameter="40"
      />
      <div class="ml-2 font-medium text-[14px] leading-[20px]">
        {{ truncateWallet(userStore?.wallet?.address as string) }}
      </div>
      <NuxtIcon
        name="icon/arrow-down"
        class="ml-2 text-[24pxy] transition-all transform"
        :class="{ 'rotate-180': isOpened }"
      />
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { truncateWallet } from '~/lib/misc/strings';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const isOpened = ref(false);

const renderNuxtIcon = (iconName: string) => {
  return () => {
    return h(resolveComponent('NuxtIcon'), { name: iconName, class: 'text' }, '');
  };
};

const options = computed(() => [
  {
    key: 'profile',
    label: t('profile.profile'),
  },
  {
    key: 'logout',
    label: t('profile.logout'),
  },
]);

function handleSelect(key: string | number) {
  if (key === 'logout') {
    userStore.logout();
    router.push('/');
  } else if (key) {
    router.push({ name: `${key}` });
  }
}
</script>
