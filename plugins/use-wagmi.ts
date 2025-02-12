import { VueQueryPlugin } from '@tanstack/vue-query';
import { createConfig, createStorage, http, WagmiPlugin } from '@wagmi/vue';
import { baseSepolia, songbird, type Chain } from '@wagmi/vue/chains';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const chains: readonly [Chain, ...Chain[]] =
    useRuntimeConfig().public.ENV === AppEnv.PROD ? [songbird] : [baseSepolia]; // TODO: change to appropriate networks or figure out how to get network by

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });

  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
