<template>
  <div class="flex-bc w-full bg-grey px-6">
    <div class="mt-2">
      <Logo class="inline-block" />
    </div>

    <div>
      <n-input placeholder="Search markets" size="large" class="min-w-[30vw]">
        <template #prefix>
          <NuxtIcon name="icon/search" />
        </template>
      </n-input>
    </div>

    <div>
      <slot />
    </div>

    <div class="flex">
      <div v-if="userStore.isConnected && userStore.loggedIn" class="flex-cc text-white">
        <!-- <HeaderNotifications /> -->
        <HeaderProfile />
      </div>
      <WalletLogin v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>
