<template>
  <n-card
    class="bg-grey border-1 !border-grey-lighter"
    :content-class="'!py-5 !pb-5 !pt-4 !rounded-[8px]'"
    :header-class="'!py-5 !px-6 bg-grey-dark !rounded-t-[8px]'"
  >
    <template #header>
      <div v-if="selectedTab === TransactionType.FUND" class="flex items-center justify-center">
        <div class="text-[12px] leading-[16px] pt-[19px] pb-[19px]">Fund this market</div>
      </div>
      <div v-else class="bg-grey-light rounded-[8px] p-3 flex flex-row items-center justify-center">
        <div class="w-[30px] h-[30px] flex-shrink-0">
          <img class="rounded-[48px] w-full h-full object-cover" :src="outcome.imgUrl" />
        </div>
        <div class="ml-2 text-[12px] leading-[16px] font-bold">{{ outcome.name }}</div>
        <div class="text-[12px] leading-[16px] font-bold ml-auto">
          {{ outcome.latestChance.chance ? (outcome.latestChance.chance * 100).toFixed(0) : 0.0 }} %
        </div>
      </div>
    </template>
    <div class="tabs-wrapper">
      <n-tabs
        type="line"
        animated
        v-model:value="selectedTab"
        :theme-overrides="{
          tabTextColorActiveLine: '#F5F5F5',
        }"
      >
        <!-- BUY PANE -->
        <n-tab-pane
          :disabled="!tradeEnabled(status, endTime) || loading"
          :name="TransactionType.BUY"
          class="!pt-[33px]"
          tab="Buy"
        >
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ tokenStore.parsedBalance }} {{ tokenStore.symbol }}</div>
              </div>
            </div>

            <n-input-number
              placeholder="0"
              min="0"
              v-model:value="amount"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              :max="tokenStore.parsedBalance"
              button-placement="both"
              :disabled="loading"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            class="w-full"
            :btnClass="[' !font-bold']"
            :size="'large'"
            :disabled="!userStore.isConnected || !enoughCollateralBalance"
            :loading="loading"
            @click="buyOutcome"
          >
            Buy
          </BasicButton>

          <div class="text-[16px] leading-[24px] text-grey-lightest font-normal mt-6">
            <div class="flex items-center justify-center">
              <div>Avg price</div>
              <div class="ml-auto text-primary">
                {{ outcome.latestChance.chance ? outcome.latestChance.chance.toFixed(3) : 0.0 }} {{ tokenStore.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Shares (receive at least)</div>
              <div class="ml-auto text-white/80">{{ returnAmount }}</div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">1.273662 {{ tokenStore.symbol }}</div>
            </div>
          </div>
        </n-tab-pane>

        <!-- SELL PANE -->
        <n-tab-pane
          :disabled="!tradeEnabled(status, endTime) || loading"
          :name="TransactionType.SELL"
          class="!pt-[33px]"
          tab="Sell"
        >
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ parseConditionalBalance(conditionalBalance) }}</div>
              </div>
            </div>

            <n-input-number
              placeholder="0"
              min="0"
              v-model:value="amount"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
              :max="parseConditionalBalance(conditionalBalance)"
              :disabled="loading"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            :disabled="!userStore.isConnected || !enoughConditionalBalance"
            class="w-full"
            :btnClass="[' !font-bold']"
            :size="'large'"
            :loading="loading"
            @click="sellOutcome"
          >
            Sell
          </BasicButton>

          <div class="text-[16px] leading-[24px] text-grey-lightest font-normal mt-6">
            <div class="flex items-center justify-center">
              <div>Avg price</div>
              <div class="ml-auto text-primary">
                {{ outcome.latestChance.chance ? outcome.latestChance.chance.toFixed(3) : 0.0 }} {{ tokenStore.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">1.273662 {{ tokenStore.symbol }}</div>
            </div>
          </div>
        </n-tab-pane>

        <!-- FUNDING PANE -->
        <n-tab-pane :disabled="!isFundEnabled || loading" :name="TransactionType.FUND" class="!pt-[33px]" tab="Fund">
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ tokenStore.parsedBalance }} {{ tokenStore.symbol }}</div>
              </div>
            </div>

            <n-input-number
              placeholder="0"
              min="0"
              v-model:value="amount"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
              :max="tokenStore.parsedBalance"
              :disabled="loading"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            class="w-full"
            :btnClass="['bg-statusBlue hover:bg-statusBlue-hover !font-bold']"
            :size="'large'"
            :disabled="!userStore.isConnected || !enoughCollateralBalance || !isFundEnabled"
            :loading="loading"
            @click="fund"
          >
            Fund
          </BasicButton>
        </n-tab-pane>
      </n-tabs>
    </div>
  </n-card>

  <modal v-model:show="showSuccessModal" class="w-[320px] border-none">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/check" class="text-primary text-[40px]"></NuxtIcon>
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Success!</div>

      <div class="flex flex-col items-center justify-center mt-5">
        <div class="text-center" v-if="selectedTab === TransactionType.FUND">
          You have successfully funded this market.
        </div>
        <div v-else class="flex flex-col items-center justify-center text-center">
          <div>You have successfully {{ selectedTab === TransactionType.BUY ? 'bought' : 'sold' }} outcome:</div>
          <div class="my-4 uppercase font-extrabold text-[18px]">{{ outcome.name }}</div>
        </div>
      </div>

      <BasicButton
        v-if="transactionHash"
        @click="openExplorer(transactionHash)"
        class="w-full font-bold mt-5"
        :size="'large'"
        >Transaction</BasicButton
      >
    </div>
  </modal>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { Address } from 'viem';
import type { OutcomeInterface } from '~/lib/types/prediction-set';
import { PredictionSetStatus, TransactionType } from '~/lib/types/prediction-set';

const props = defineProps({
  contractAddress: { type: String, default: null, required: true },
  outcome: { type: Object as PropType<OutcomeInterface>, default: {}, required: true },
  status: { type: Number as PropType<PredictionSetStatus>, default: null, required: true },
  action: { type: Number as PropType<TransactionType>, default: null, required: false },
  endTime: { type: Date, default: null, required: false },
});

const { getMaxTokensToSell, getMinTokensToBuy, addFunding, buy, sell } = useFixedMarketMaker();
const { refreshCollateralBalance, getTokenStore } = useCollateralToken();
const { getConditionalBalance, parseConditionalBalance } = useConditionalToken();
const message = useMessage();
const txWait = useTxWait();
const tokenStore = getTokenStore();
const userStore = useUserStore();

const selectedTab = ref(TransactionType.BUY);
const isFundEnabled = ref(true);
const slippage = ref(0);
const loading = ref(false);
const amount = ref<number>();
const returnAmount = ref<string>('0.0');
const conditionalBalance = ref(BigInt(0));

const showSuccessModal = ref(false);
const transactionHash = ref('');

const enoughConditionalBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** tokenStore.decimals));
  return conditionalBalance.value >= scaledAmount;
});

const enoughCollateralBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** tokenStore.decimals));
  return tokenStore.balance >= scaledAmount;
});

onMounted(async () => {
  if (props.status === PredictionSetStatus.FUNDING) {
    selectedTab.value = TransactionType.FUND;
  } else if (props.action) {
    selectedTab.value = props.action;
  }

  await refreshCollateralBalance();
});

watchEffect(async () => {
  if (props.outcome.positionId) {
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
  }
});

watch(
  () => props.action,
  () => {
    selectedTab.value = props.action;
  }
);

watchDebounced(
  () => amount.value,
  async () => {
    if (amount.value === 0) {
      returnAmount.value = '0.0';
      return;
    }

    if (!amount.value) {
      returnAmount.value = '0.0';
      return;
    }

    if (selectedTab.value === TransactionType.BUY) {
      await updateBuyAmount();
    } else if (selectedTab.value === TransactionType.SELL) {
      await updateSellAmount();
    }
  },
  { debounce: 500, maxWait: 1000 }
);

async function updateBuyAmount() {
  if (!amount.value) {
    return;
  }

  const result = await getMinTokensToBuy(
    props.contractAddress as Address,
    amount.value,
    props.outcome.outcomeIndex,
    slippage.value
  );

  returnAmount.value = (Number(result) / Math.pow(10, tokenStore.decimals)).toString();
}

async function updateSellAmount() {
  if (!amount.value) {
    return;
  }

  const result = await getMaxTokensToSell(
    props.contractAddress as Address,
    amount.value,
    props.outcome.outcomeIndex,
    slippage.value
  );

  returnAmount.value = '';
}

async function fund() {
  transactionHash.value = '';
  loading.value = true;
  try {
    await refreshCollateralBalance();

    if (!amount.value || !enoughCollateralBalance.value) {
      return;
    }

    txWait.hash.value = await addFunding(props.contractAddress as Address, amount.value);
    const receipt = await txWait.wait();

    showSuccessModal.value = true;
    transactionHash.value = receipt?.data?.transactionHash || '';

    amount.value = '' as any;
    await refreshCollateralBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function sellOutcome() {
  transactionHash.value = '';
  loading.value = true;
  try {
    await refreshCollateralBalance();

    if (!amount.value) {
      return;
    }

    txWait.hash.value = await sell(
      props.contractAddress as Address,
      amount.value,
      props.outcome.outcomeIndex,
      slippage.value,
      props.outcome.latestChance.chance
    );
    const receipt = await txWait.wait();

    showSuccessModal.value = true;
    transactionHash.value = receipt?.data?.transactionHash || '';

    amount.value = '' as any;
    await refreshCollateralBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function buyOutcome() {
  transactionHash.value = '';
  loading.value = true;
  try {
    await refreshCollateralBalance();

    if (!amount.value || !enoughCollateralBalance.value) {
      return;
    }

    txWait.hash.value = await buy(
      props.contractAddress as Address,
      amount.value,
      props.outcome.outcomeIndex,
      slippage.value
    );
    const receipt = await txWait.wait();

    showSuccessModal.value = true;
    transactionHash.value = receipt?.data?.transactionHash || '';

    amount.value = '' as any;
    await refreshCollateralBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function openExplorer(txHash: string) {
  const explorer = getChain().blockExplorers.default.url;

  window.open(`${explorer}/tx/${txHash}`, '_blank');
}
</script>

<style scoped>
.tabs-wrapper :deep(.n-tabs-nav) {
  position: relative;
}

.tabs-wrapper :deep(.n-tabs-nav::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: -24px;
  right: -24px;
  height: 1px;
  background-color: var(--n-tab-border-color);
}

.tabs-wrapper :deep(.n-tabs-bar) {
  bottom: 0 !important;
}

.tabs-wrapper :deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
  border-bottom: none;
}
</style>
