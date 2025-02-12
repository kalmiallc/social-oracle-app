<template>
  <div class="border-1 border-grey-lighter rounded-lg mt-6 flex-col p-6 font-medium text-[14px] leading-[20px]">
    <div class="flex items-center pb-4 border-b-1 border-b-grey-lighter">
      <NuxtIcon
        class="text-white text-[17px] mr-[17px]"
        name="icon/funding"
        :class="{ '!text-grey-lightest': Phase.FUNDING < activePhase }"
      />
      <div :class="{ '!text-grey-lightest': Phase.FUNDING < activePhase }">
        Funding on {{ toMonthAndYear(predictionSet.createTime) }}
      </div>

      <NuxtIcon v-if="Phase.FUNDING < activePhase" class="text-primary text-[17px] ml-auto" name="icon/complete" />

      <div v-if="Phase.FUNDING === activePhase" class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
        <div class="w-[7px] h-[7px] bg-statusGreen rounded-full"></div>
      </div>
    </div>

    <div class="flex items-center py-4 border-b-1 border-b-grey-lighter">
      <NuxtIcon
        :class="{ '!text-grey-lightest': Phase.STARTED < activePhase }"
        class="text-white text-[17px] mr-[17px]"
        name="icon/calendar"
      />
      <div :class="{ '!text-grey-lightest': Phase.STARTED < activePhase }">
        Started on {{ toMonthAndYear(predictionSet.startTime) }}
      </div>

      <NuxtIcon v-if="Phase.STARTED < activePhase" class="text-primary text-[17px] ml-auto" name="icon/complete" />

      <div v-if="Phase.STARTED === activePhase" class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
        <div class="w-[7px] h-[7px] bg-statusGreen rounded-full"></div>
      </div>
    </div>

    <div class="flex items-center py-4 border-b-1 border-b-grey-lighter">
      <NuxtIcon
        :class="{ '!text-grey-lightest': Phase.ENDS < activePhase }"
        class="text-white text-[17px] mr-[17px]"
        name="icon/flag"
      />
      <div :class="{ '!text-grey-lightest': Phase.ENDS < activePhase }">
        Ends on {{ toMonthAndYear(predictionSet.endTime) }}
      </div>

      <NuxtIcon v-if="Phase.ENDS < activePhase" class="text-primary text-[17px] ml-auto" name="icon/complete" />
    </div>

    <div class="flex items-center pt-4">
      <NuxtIcon class="text-white text-[17px] mr-[17px]" name="icon/trophy" />
      <div>Results on {{ toMonthAndYear(predictionSet.resolutionTime) }}</div>

      <div v-if="Phase.RESULTS === activePhase" class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
        <div class="w-[7px] h-[7px] bg-statusGreen rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PredictionSetStatus, type PredictionSetInterface } from '~/lib/types/prediction-set';

enum Phase {
  FUNDING = 1,
  STARTED = 2,
  ENDS = 4,
  RESULTS = 5,
}

const props = defineProps({
  predictionSet: { type: Object as PropType<PredictionSetInterface>, default: {}, required: true },
});

const activePhase = computed(() => {
  if (props.predictionSet.setStatus === PredictionSetStatus.FUNDING) {
    return Phase.FUNDING;
  }

  if (props.predictionSet.setStatus === PredictionSetStatus.ACTIVE) {
    if (Number(new Date()) > Number(new Date(props.predictionSet.endTime))) {
      return Phase.RESULTS;
    }
    return Phase.STARTED;
  }

  return Phase.RESULTS;
});

onMounted(() => {});

watch(
  () => activePhase.value,
  () => {
    console.log(activePhase.value);
  }
);
</script>
