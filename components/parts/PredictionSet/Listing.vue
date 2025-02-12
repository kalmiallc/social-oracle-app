<template>
  <div ref="grid" class="grid grid-cols-4 gap-4">
    <PredictionSetCard :predictionSet="predictionSet" v-for="predictionSet in predictionSets"></PredictionSetCard>
  </div>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  category: { type: String, default: '' },
});

const message = useMessage();

const grid = ref();
const predictionSets = ref(<any[]>[]);
const loading = ref(false);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

onMounted(async () => {
  await getPredictionSets();
});

const {} = useInfiniteScroll(
  grid,
  async () => {
    if (!loading.value) {
      await getPredictionSets();
    }
  },
  {
    distance: 10,
    canLoadMore: () => {
      return !!total.value && total.value > predictionSets.value.length;
    },
  }
);

async function getPredictionSets() {
  loading.value = true;
  try {
    const res = await $api.get<any>(Endpoints.predictionSets, {
      category: props.category,
      orderBy: 'id',
      limit: limit.value,
      desc: 'true',
      page: page.value,
    });

    if (res.data) {
      predictionSets.value.push(...(res.data.items as any[]));
    }

    page.value += 1;
    total.value = res?.data?.total || 0;
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}
</script>
