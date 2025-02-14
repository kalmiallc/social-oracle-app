<template>
  <div class="flex-bc w-full bg-grey px-6 h-[86px]">
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
        <BasicButton size="large" class="mr-4" @click="showFundModal = true">Fund</BasicButton>
        <HeaderProfile />
      </div>
      <WalletLogin v-else />
    </div>
  </div>

  <modal v-model:show="showFundModal" class="border-none w-[400px]" :mask-closable="!loading">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-3">
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Circle (Base Coin) -->
          <circle cx="50" cy="50" r="45" fill="url(#coinGradient)" stroke="#8A3A8D" stroke-width="3" />

          <!-- Inner Decorative Ring -->
          <circle cx="50" cy="50" r="40" fill="none" stroke="#D88ADC" stroke-width="3" stroke-dasharray="5,3" />

          <!-- Outer Shine (Subtle light reflection) -->
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3" />

          <!-- Coin Edge Detailing (Lines along the coin edge) -->
          <circle cx="50" cy="50" r="44" fill="none" stroke="#C56AC6" stroke-width="2" stroke-dasharray="4,2" />

          <!-- Subtle Coin Engravings (Accents for texture) -->
          <g fill="#C56AC6">
            <circle cx="50" cy="10" r="2" />
            <circle cx="50" cy="90" r="2" />
            <circle cx="10" cy="50" r="2" />
            <circle cx="90" cy="50" r="2" />
            <circle cx="20" cy="20" r="2" />
            <circle cx="80" cy="80" r="2" />
            <circle cx="80" cy="20" r="2" />
            <circle cx="20" cy="80" r="2" />
          </g>

          <!-- Main Text (Larger) -->
          <text
            x="50%"
            y="52%"
            font-family="Arial, sans-serif"
            font-size="16"
            fill="white"
            font-weight="bold"
            text-anchor="middle"
            alignment-baseline="middle"
          >
            TREND
          </text>

          <!-- Gradient Definition -->
          <defs>
            <radialGradient id="coinGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color: #d88adc; stop-opacity: 1" />
              <stop offset="50%" style="stop-color: #b14ab3; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #8a3a8d; stop-opacity: 1" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div class="flex flex-row items-center justify-center text-[14px] leading-[20px] font-medium text-center">
        $TREND is the native cryptocurrency of the Social Oracle platform, designed to fuel predictions on social
        events. It empowers users to stake, trade, and forecast the future of viral trends, emerging topics, and key
        moments in the social media world. As the heart of the prediction market, TREND allows participants to monetize
        their insights while staying ahead of the curve in the ever-changing landscape of social dynamics.
      </div>

      <n-input-number
        placeholder="0"
        min="0"
        v-model:value="amount"
        size="large"
        class="min-w-full text-center mt-6"
        type="number"
        :show-button="true"
        :max="1000"
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

      <BasicButton class="w-full mt-3" size="large" :loading="loading">FUND</BasicButton>
    </div>
  </modal>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const loading = ref(false);
const showFundModal = ref(false);

const amount = ref(0);
</script>
