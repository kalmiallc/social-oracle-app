<template>
  <n-card class="mb-4" size="small">
    <template #header>
      <span class="icon-info mr-2 text-xl"></span>
      <span class="relative -top-[2px] inline-block">New version deployed</span>
    </template>
    <template #header-extra>
      <NuxtIcon name="dashboard/check" class="text-2xl" />
    </template>

    <p>{{ notification.message }}</p>

    <template #footer>
      <div class="text-right">
        <span>{{ dateTimeToDate(notification.createTime) }}</span>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { dateTimeToDate } from '~/lib/utils/dates';

defineProps({
  notification: { type: Object as PropType<NotificationInterface>, default: {} },
});
</script>
