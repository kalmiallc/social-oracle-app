<template>
  <Dashboard :loading="userStore.loadingProfile">
    <slot>
      <FormWrapper class="mt-8" :title="'Account information'">
        <FormUserProfile />
      </FormWrapper>

      <FormWrapper class="mt-8" :title="'GitHub bonuses'">
        <div>
          Being an active part of developer community and contributing to open source project can bring you some
          additional benefits on Social Oracle.
        </div>
        <n-table :bordered="false" :single-line="false" class="mt-4">
          <thead>
            <tr>
              <th>Followers + Contributions (Current year)</th>
              <th>Trading Fee</th>
            </tr>
          </thead>
          <tbody>
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
      </FormWrapper>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const userStore = useUserStore();

useHead({
  title: t('profile.mySettings'),
});
</script>
