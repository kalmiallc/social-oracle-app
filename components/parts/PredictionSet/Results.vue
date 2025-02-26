<template>
  <div class="border-1 border-grey-lighter bg-grey-light rounded-lg p-8 flex flex-col justify-center items-center">
    <div class="font-normal text-[16px] leading-[24px] text-white/80">Outcome winner</div>
    <div class="w-[64px] h-[64px] flex-shrink-0 mt-5">
      <img class="rounded-[48px] w-full h-full object-cover" :src="outcome.imgUrl" />
    </div>

    <div class="font-bold text-[16px] leading-[24px] mt-2">{{ outcome.name }}</div>
    <div class="w-[70%] border-b-1 border-grey-lighter pt-5"></div>

    <div v-if="canClaim" class="flex items-center justify-center mt-5">
      <NuxtIcon name="icon/star" class="text-primary text-[17px]" />
      <BasicButton :loading="loading" @click="claimWinnings" size="small" class="py-[6px] px-[10px]">Claim</BasicButton>
    </div>

    <div v-if="canWithdrawFunding" class="flex items-center justify-center mt-5">
      <BasicButton
        :loading="loading"
        @click="withdrawFunding"
        :class="['bg-statusBlue hover:bg-statusBlue-hover']"
        class="py-[6px] px-[10px]"
        size="small"
      >
        Withdraw Funding
      </BasicButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Address } from 'viem';
import type { OutcomeInterface } from '~/lib/types/prediction-set';

const { getConditionalBalance, claim } = useConditionalToken();
const { getFundingBalance, removeFunding } = useFixedMarketMaker();
const message = useMessage();
const txWait = useTxWait();

const props = defineProps({
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  conditionId: { type: String, default: null, required: true },
  outcome: { type: Object as PropType<OutcomeInterface>, default: {}, required: true },
});

const canClaim = ref(false);
const canWithdrawFunding = ref(false);

const claimBalance = ref(BigInt(0));
const fundingBalance = ref(BigInt(0));

const loading = ref(false);

onMounted(async () => {
  await updateClaimBalance();
  await updateFundingBalance();
});

async function updateClaimBalance() {
  claimBalance.value = await getConditionalBalance(props.outcome.positionId);
  canClaim.value = claimBalance.value > BigInt(0);
}

async function updateFundingBalance() {
  fundingBalance.value = await getFundingBalance(props.contractAddress);
  canWithdrawFunding.value = fundingBalance.value > BigInt(0);
}

async function claimWinnings() {
  await updateClaimBalance();

  if (!claimBalance.value || !canClaim.value) {
    return;
  }

  loading.value = true;
  try {
    txWait.hash.value = await claim(props.conditionId, props.outcome.outcomeIndex);
    const receipt = await txWait.wait();

    await updateClaimBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function withdrawFunding() {
  await updateFundingBalance();

  if (!fundingBalance.value || !canWithdrawFunding.value) {
    return;
  }

  loading.value = true;
  try {
    txWait.hash.value = await removeFunding(props.contractAddress, fundingBalance.value);
    await txWait.wait();

    await updateFundingBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}
</script>
