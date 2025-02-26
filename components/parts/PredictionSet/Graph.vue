<template>
  <div class="flex items-center gap-2 mb-4">
    <div v-for="range in ranges" :key="range">
      <BasicButton
        v-if="!isRangeDisabled(range)"
        size="small"
        class="!bg-grey w-[46px] h-[26px]"
        :class="selectedRange === range ? 'border-primary border-2' : ''"
        @click="() => (selectedRange = range)"
      >
        {{ range }}
      </BasicButton>
    </div>
  </div>
  <client-only> <VChart :option="options" autoresize class="h-[400px] w-[calc(100%+70px)] -ml-[20px]" /></client-only>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';
import type { PredictionSetChanceHistoryResponse } from '~/lib/types/prediction-set';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import VChart from 'vue-echarts';

const props = defineProps({
  predictionId: { type: Number, default: null, required: true },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  outcomes: { type: Array as PropType<{ id: number; name: string; color: string }[]>, default: [] },
});
use([CanvasRenderer, LineChart, TooltipComponent, GridComponent]);

type Options = ComposeOption<GridComponentOption | TooltipComponentOption>;

const ranges = ['ALL', '1D', '1W', '1M'] as const;
const selectedRange = ref<(typeof ranges)[number]>('ALL');

const options = ref({
  grid: {
    backgroundColor: '#212120',
    borderWidth: 0,
    show: true,
    left: 20,
    right: 50,
    bottom: 30,
    top: 0,
  },
  xAxis: {
    type: 'time',
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: '#fff',
      margin: 12,
      hideOverlap: true,
      alignMinLabel: 'right',
      overflow: 'truncate',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false,
    },
    axisLabel: {
      formatter: value => {
        return value * 100 + '%';
      },
      color: '#fff',
      margin: 12,
      showMinLabel: false,
      showMaxLabel: false,
    },
    position: 'right',
    max: 1,
    min: 0
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#212120',
    valueFormatter: (value: number) => {
      return +(value * 100).toFixed(2) + '%';
    },
  },
  series: [] as LineSeriesOption[],
} as Options);

onMounted(async () => {
  await getChanceHistory();
});

watchDebounced(
  () => selectedRange.value,
  async () => {
    getChanceHistory(selectedRange.value);
  },
  { debounce: 1000 }
);

function isRangeDisabled(range: (typeof ranges)[number]) {
  const timeDiff = new Date(props.endTime)?.getTime() - new Date(props.startTime)?.getTime();
  switch (range) {
    case '1W':
      return timeDiff < 7 * 24 * 60 * 60 * 1000;
    case '1M':
      return timeDiff < 30 * 24 * 60 * 60 * 1000;
    default:
      return false;
  }
}

async function getChanceHistory(range: (typeof ranges)[number] = 'ALL') {
  const res = await $api.get<PredictionSetChanceHistoryResponse>(
    Endpoints.predictionSetChanceHistory(Number(props.predictionId)),
    { range }
  );

  const data = Object.keys(res.data).map(key => ({
    name: props.outcomes.find(o => o.id === Number(key))?.name,
    color: props.outcomes.find(o => o.id === Number(key))?.color,
    type: 'line' as const,
    showSymbol: false,
    data: res.data[key].map(x => [x.date, x.chance]),
  }));
  options.value.series = data;
}
</script>
