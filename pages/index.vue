<template>
  <Dashboard>
    <PredictionSetListing :category="'top'"></PredictionSetListing>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

onMounted(() => {});

async function getMarkets() {}
</script>
