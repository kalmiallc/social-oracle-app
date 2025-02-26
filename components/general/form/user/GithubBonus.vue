<template>
  <div>
    Being an active part of developer community and contributing to open source project can bring you some additional
    benefits on Social Oracle.
  </div>

  <div v-if="user.githubId" class="mt-4">
    <div>Your Followers: {{ user.githubFollowers }}</div>
    <div>Your Contributions: {{ user.githubContributions }}</div>
  </div>
  <n-table :bordered="false" :single-line="false" class="mt-4">
    <thead>
      <tr>
        <th>Followers + Contributions (Current year)</th>
        <th>Trading Fee</th>
      </tr>
    </thead>
    <tbody :class="user?.githubId && `highlight-row-${(user.githubTier ?? 0) + 1}`">
      <tr>
        <td>0 - 99</td>
        <td>3%</td>
      </tr>

      <tr>
        <td>100 - 299</td>
        <td>2.5%</td>
      </tr>

      <tr>
        <td>300 - 499</td>
        <td>2%</td>
      </tr>

      <tr>
        <td>500 - 799</td>
        <td>1.5%</td>
      </tr>

      <tr>
        <td>800 - 999</td>
        <td>1%</td>
      </tr>

      <tr>
        <td>1000+</td>
        <td>0.5%</td>
      </tr>
    </tbody>
  </n-table>
</template>

<script lang="ts" setup>
const { user } = useUserStore();
</script>

<style scoped>
.highlight-row-1 tr:nth-child(1) td,
.highlight-row-2 tr:nth-child(2) td,
.highlight-row-3 tr:nth-child(3) td,
.highlight-row-4 tr:nth-child(4) td,
.highlight-row-5 tr:nth-child(5) td,
.highlight-row-6 tr:nth-child(6) td {
  background-color: #8a3a8d;
}
</style>
