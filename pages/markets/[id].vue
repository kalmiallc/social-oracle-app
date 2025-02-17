<template>
  <Dashboard :loading="loading">
    <div v-if="predictionSet" class="flex flex-row justify-center">
      <div class="flex flex-col max-w-[736px]">
        <!-- HEADER -->
        <div class="flex">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <img class="rounded-[8px] w-full h-full object-cover" :src="predictionSet.imgUrl" />
          </div>
          <div class="flex flex-col ml-8">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">
              {{ predictionSet.question }}
            </div>

            <div class="flex mt-4 items-center">
              <Status :status="predictionSet.setStatus" :endTime="predictionSet.endTime.toString()"></Status>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">
                Ends on {{ toMonthAndYear(predictionSet.endTime) }}
              </div>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">1,283 USDC</div>
            </div>
          </div>
        </div>

        <!-- OUTCOMES -->
        <div class="flex flex-col gap-y-[6px] mt-10">
          <div
            v-for="outcome in predictionSet.outcomes"
            class="flex bg-grey rounded-lg pl-3 py-[6px] items-center w-full"
            :class="{ 'border-1 border-primary': winningOutcome?.id === outcome.id }"
          >
            <div class="flex">
              <div class="w-[56px] h-[56px] flex-shrink-0">
                <img class="rounded-[78px] w-full h-full object-cover" :src="outcome.imgUrl" />
              </div>

              <div class="flex flex-col ml-4">
                <div class="text-[16px] leading-[24px] font-bold text-white pt-[4px]">
                  {{ outcome.name }}
                </div>

                <div class="text-[14px] leading-[20px] font-medium text-grey-lightest mt-[4px]">$ 1,845,924</div>
              </div>
            </div>

            <div class="flex items-center ml-auto pr-4">
              <div
                class="font-bold text-[16px] leading-[24px]"
                v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
              >
                {{ Number(outcome.latestChance.chance * 100).toFixed(0) }} %
              </div>

              <div v-if="winningOutcome?.id === outcome.id" class="flex items-center justify-center">
                <NuxtIcon class="text-primary text-[24px]" name="icon/complete" />
              </div>

              <div class="flex ml-auto pl-9" v-if="tradeEnabled(predictionSet.setStatus, predictionSet.endTime)">
                <BasicButton
                  class="mr-3"
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusGreen/20 border-statusGreen hover:bg-statusGreen']"
                  @click="selectOutcome(TransactionType.BUY, outcome)"
                  :selected="selectedOutcome.id === outcome.id && selectedAction === TransactionType.BUY"
                  :selectedClass="['!bg-statusGreen !border-statusGreen']"
                >
                  Buy
                </BasicButton>
                <BasicButton
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusRed/20 border-statusRed hover:bg-statusRed']"
                  @click="selectOutcome(TransactionType.SELL, outcome)"
                  :selected="selectedOutcome.id === outcome.id && selectedAction === TransactionType.SELL"
                  :selectedClass="['!bg-statusRed !border-statusRed']"
                >
                  Sell
                </BasicButton>
              </div>
            </div>
          </div>
        </div>

        <!-- RULES -->
        <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6">
          <div class="font-bold text-[14px] leading-[20px] mb-4 text-white">Rules</div>
          <div class="font-medium text-[14px] leading-[20px] mb-4 text-white/80">
            {{ predictionSet.outcomeResolutionDef }}
          </div>
        </div>

        <!-- CONTRACTS -->
        <div
          class="border-1 border-grey-lighter rounded-lg mt-10 p-6 grid grid-cols-2 font-medium text-[14px] leading-[20px]"
        >
          <div class="flex border-r-[0.5px] border-r-grey-lighter pr-11 items-center">
            <div class="text-white/80">Contract</div>
            <div
              class="ml-auto font-bold hover:text-primary cursor-pointer"
              @click="openExplorer(predictionSet.chainData.contractAddress)"
            >
              {{ shortenAddress(predictionSet.chainData.contractAddress) }}
            </div>
            <NuxtIcon
              class="ml-2 text-white cursor-pointer"
              name="icon/copy"
              @click="copyToClipboard(predictionSet.chainData.contractAddress)"
            />
          </div>

          <div class="flex border-l-[0.5px] border-l-grey-lighter pl-11 items-center">
            <div class="text-white/80">Resolver</div>
            <div
              class="ml-auto font-bol hover:text-primary cursor-pointer"
              @click="openExplorer(config.public.ORACLE_CONTRACT)"
            >
              {{ shortenAddress(config.public.ORACLE_CONTRACT) }}
            </div>
            <NuxtIcon
              class="ml-2 text-white cursor-pointer"
              name="icon/copy"
              @click="copyToClipboard(config.public.ORACLE_CONTRACT)"
            />
          </div>
        </div>
      </div>

      <div class="sticky top-0 self-start ml-24 w-[409px]">
        <PredictionSetAction
          v-if="actionsEnabled(predictionSet.setStatus, predictionSet.endTime)"
          :contract-address="predictionSet.chainData.contractAddress"
          :outcome="selectedOutcome"
          :action="selectedAction"
          :status="predictionSet.setStatus"
          :end-time="predictionSet.endTime"
        >
        </PredictionSetAction>

        <PredictionSetPhase
          v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
          :prediction-set="predictionSet"
        >
        </PredictionSetPhase>

        <PredictionSetResults
          v-if="predictionSet.setStatus === PredictionSetStatus.FINALIZED"
          :outcome="winningOutcome"
          :contract-address="predictionSet.chainData.contractAddress"
          :condition-id="predictionSet.chainData.conditionId"
        >
        </PredictionSetResults>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import Status from '~/components/parts/PredictionSet/Status.vue';
import {
  type OutcomeInterface,
  type PredictionSetInterface,
  type PredictionSetResponse,
  PredictionSetStatus,
  TransactionType,
} from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

const REFRESH_INTERVAL = 10_000;

const { params } = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const loading = ref<boolean>(true);
const refreshInterval = ref<NodeJS.Timeout>();
const predictionSet = ref<PredictionSetInterface | null>();
const selectedOutcome = ref();
const selectedAction = ref();
const winningOutcome = ref();

onMounted(async () => {
  await sleep(10);
  await getPredictionSet();
});

async function selectOutcome(transaction: TransactionType, outcome: OutcomeInterface) {
  selectedAction.value = transaction;
  selectedOutcome.value = outcome;
}

async function getPredictionSet(silent: boolean = false) {
  if (!silent) {
    loading.value = true;
  }

  try {
    const res = await $api.get<PredictionSetResponse>(Endpoints.predictionSetsById(Number(params?.id)));
    predictionSet.value = res.data;

    if (predictionSet.value.setStatus === PredictionSetStatus.FINALIZED) {
      winningOutcome.value = predictionSet.value.outcomes.find(o => o.id === predictionSet.value?.winner_outcome_id);

      clearInterval(refreshInterval.value);
    } else {
      // TODO: look at url if another outcome is selected.
      if (!selectedOutcome.value || !selectedAction.value) {
        selectedOutcome.value = predictionSet.value.outcomes[0];
        selectedAction.value = TransactionType.BUY;
      }

      if (!refreshInterval.value) {
        refreshInterval.value = setInterval(async () => {
          await getPredictionSet(true);
        }, REFRESH_INTERVAL);
      }
    }
  } catch (error) {
    router.push({ name: 'index' });
  } finally {
    loading.value = false;
  }
}

async function openExplorer(address: string) {
  const explorer = getChain().blockExplorers.default.url;

  window.open(`${explorer}/address/${address}`, '_blank');
}
</script>
