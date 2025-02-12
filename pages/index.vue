<template>
  <Dashboard>
    <PredictionSetListing :category="'top'"></PredictionSetListing>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

async function getMarkets() {}
</script>
