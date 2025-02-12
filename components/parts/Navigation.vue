<template>
  <Menu
    :indent="0"
    :options="menuOptions"
    :default-expand-all="true"
    :expanded-keys="['menu-borrow', 'menu-earn', 'menu-explore']"
    :expand-icon="() => {}"
    slice-name
    inverted
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions = [
  {
    label: 'Borrow',
    key: 'menu-borrow',
    children: [
      { key: 'index', label: 'Dashboard', to: 'index', iconName: 'icon/home' },
      { key: 'index', label: 'Get a loan', to: 'index', iconName: 'icon/home' },
      { key: 'multi-loan', label: 'Multi NFT offer request', to: 'loan-multi-nft', iconName: 'icon/home' },
    ],
  },
  {
    label: 'Earn',
    key: 'menu-earn',
    children: [
      { key: 'index', label: 'Get a loan', to: 'index', iconName: 'icon/home' },
      { key: 'loan', label: 'My loans', to: 'loan', iconName: 'icon/home' },
      // { key: 'multi-loan', label: 'Multi NFT loan', to: 'loan-multi-nft' },
      { key: 'offer-requests', label: 'Proposals', to: 'offer-requests', iconName: 'icon/home' },
    ],
  },
  {
    label: 'Explore',
    key: 'menu-explore',
    children: [
      // { key: 'loan-seekers', label: 'Loan seeker', to: 'offers' },
      { key: 'assets', label: 'My assets', to: 'assets', iconName: 'icon/home' },
      { key: 'offers', label: 'Offers', to: 'offers', iconName: 'icon/home' },
      { key: 'offers-my', label: 'Offers history', to: 'offers-my', iconName: 'icon/home' },
      // { key: 'multi-offer', label: 'Multi offer', to: 'offers' },
      // { key: 'offer-history', label: 'History', to: 'offers' },
    ],
  },
];
</script>
