<template>
  <div>
    <Header ref="headerRef" class="min-h-[86px]" />
    <NavigationNew />
    <!-- <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
      @update:value="handleMenuUpdate"
      class="tab-style"
    /> -->

    <div v-if="loading || loadingInit">
      <transition name="fade" appear>
        <div v-if="loadingAnimation" class="w-full flex flex-col gap-2 h-screen">
          <div class="w-full flex flex-col gap-2 pt-4" :style="heightScreen">
            <!-- Loading skeleton - on long page load show skeleton -->
            <n-skeleton height="40px" width="100%" />
            <n-skeleton height="40px" width="100%" />
            <div class="flex gap-2 h-full">
              <div style="width: 100%">
                <n-skeleton height="80%" width="100%" />
              </div>
              <div style="width: 320px">
                <n-skeleton height="80%" width="100%" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-else>
      <div class="flex flex-auto w-full flex-col md:flex-row bg-grey-dark">
        <n-layout class="has-scrollbar">
          <n-layout-content>
            <n-scrollbar y-scrollable :style="scrollScreen">
              <div class="flex flex-col gap-4 justify-between pt-4" :style="fullHeight ? heightScreen : {}">
                <div class="flex flex-col items-center w-full">
                  <div class="xl:max-w-[1520px] w-full px-4">
                    <slot />
                  </div>
                </div>
                <div>
                  <slot name="bottom" />
                </div>
              </div>
            </n-scrollbar>
          </n-layout-content>
        </n-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const props = defineProps({
  fullHeight: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
});

const { isConnected, refreshData } = usePrivy();
const userStore = useUserStore();

/** Heading height */
const headerRef = useTemplateRef('headerRef');

const calcHeaderHeight = () => (headerRef.value?.$el?.clientHeight || 86) + 60;
const headerHeight = ref<number>(calcHeaderHeight());

const scrollScreen = computed(() => ({
  maxHeight: `calc(100dvh - ${headerHeight.value}px)`,
}));
const heightScreen = computed(() => ({
  minHeight: `calc(100dvh - ${headerHeight.value}px)`,
}));

const { width } = useWindowSize();
watch(
  () => width.value,
  () => (headerHeight.value = calcHeaderHeight())
);

/** Delay animation */
const loadingAnimation = ref<boolean>(false);
const loadingInit = ref(true);
setLoadingAnimation(loadingInit.value);

onMounted(async () => {
  const connected = await isConnected();

  if (!connected || !userStore.loggedIn) {
    userStore.logout();
  } else {
    userStore.setConnected(true);
    await refreshData();
  }
  loadingInit.value = false;

  setLoadingAnimation(props.loading);
});

watch(
  () => props.loading,
  isLoading => {
    setLoadingAnimation(isLoading);
  }
);
function setLoadingAnimation(isLoading: boolean) {
  const delay = isLoading ? 10 : 0;
  setTimeout(() => {
    loadingAnimation.value = isLoading;
    headerHeight.value = calcHeaderHeight();
  }, delay);
}
</script>
