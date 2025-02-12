<template>
  <div v-if="userStore.notifications.loading" class="relative h-8 w-8">
    <Spinner />
  </div>
  <n-dropdown
    v-else
    class="scrollable max-h-96 min-w-48 overflow-y-auto rounded-lg lg:min-w-96 xl:max-h-[60vh]"
    placement="bottom-end"
    trigger="click"
    :key="userStore.notifications.items.length"
    :options="options"
    :render-option="renderOption"
    @select="handleSelect"
  >
    <div class="cursor-pointer p-2 text-blue">
      <NuxtIcon name="icon/notifications" class="text-2xl" filled />
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

onMounted(() => {
  userStore.getNotifications();
});

const options = computed(() => {
  if (!userStore.hasNotifications) {
    return [{ key: 'empty', label: '' }];
  }
  const notifications = userStore.notifications.items.map(n => ({
    key: n.id,
    label: n.message,
    notification: n,
  }));
  return [
    ...notifications,
    {
      key: 'footer',
      label: '',
    },
  ];
});

function renderOption({ node, option }) {
  if (option?.key === 'empty') {
    return h(resolveComponent('HeaderNotificationEmpty'));
  }
  if (option?.key === 'footer') {
    return h(resolveComponent('HeaderNotificationFooter'));
  }
  return h(resolveComponent('HeaderNotification'), { notification: option.notification });
}

function handleSelect(key: string | number) {
  console.log(key);
}
</script>
