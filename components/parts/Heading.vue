<template>
  <div class="p-6 relative z-0" :class="[$style.heading, { [$style.reversed]: reversed }]">
    <div class="md:max-w-sm md:pr-2 text-white">
      <h1>{{ title }}</h1>
      <p v-if="content" class="mt-6 mb-0 text-base" :class="{ 'text-black': reversed }">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  reversed: { type: Boolean, default: false },
});
</script>

<style lang="postcss" module>
.heading:before {
  content: '';
  background-image: url(~/assets/images/heading-bg.png);
  @apply absolute left-0 top-0 w-full h-full bg-cover bg-no-repeat bg-center rounded-lg -z-1;
}
.reversed:before {
  @apply -scale-100;
}
</style>
