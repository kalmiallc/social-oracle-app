<!-- TODO: this is somehow too big? -->
<template>
  <div class="flex items-center justify-center p-0 m-0">
    <div
      :class="getStatusClass(status, endTime)"
      class="font-bold rounded-[20px] py-[2px] px-[6px] text-[12px] leading-4 tracking-[0.04em]"
    >
      {{ getStatusName(status, endTime) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null, required: true },
  endTime: { type: String || Date, default: null, required: true },
});
</script>
