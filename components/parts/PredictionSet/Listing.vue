<template>
  <div ref="grid" class="grid grid-cols-4 gap-4 max-h-[82vh] overflow-y-scroll pr-2">
    <PredictionSetCard :predictionSet="predictionSet" v-for="predictionSet in predictionSets"></PredictionSetCard>
  </div>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  tag: { type: String, default: '' },
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
    const query = {
      orderBy: 'id',
      limit: limit.value,
      desc: 'true',
      page: page.value,
    };

    if (props.tag) {
      query['tag'] = props.tag;
    }

    const res = await $api.get<any>(Endpoints.predictionSets, query);

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

<style>
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 1rem;
}

/* Handle */
::-webkit-scrollbar-thumb {
  cursor: pointer;
  background: #b14ab3;
  border-radius: 1rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  opacity: 0.7;
}
</style>
