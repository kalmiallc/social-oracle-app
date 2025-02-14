// plugins/privy.client.ts
import { defineNuxtPlugin } from '#app';
import { LocalStorage } from '@privy-io/js-sdk-core';
import Privy from '@privy-io/js-sdk-core';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();

  if (import.meta.server) return;

  const chain = getChain();

  // Initialize the Privy client
  const privy = new Privy({
    appId: config.public.PRIVY_APP_ID,
    clientId: config.public.PRIVY_CLIENT_ID,
    storage: new LocalStorage(),
    supportedChains: [chain],
  });

  // Create and append the iframe
  const iframeUrl = privy.embeddedWallet.getURL(); // This is synchronous
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  iframe.style.display = 'none'; // Hide iframe if needed
  document.body.appendChild(iframe);

  iframe.onload = () => {
    if (iframe.contentWindow) {
      // Set up message passing
      privy.setMessagePoster(iframe.contentWindow as any);
      window.addEventListener('message', (event: MessageEvent) => {
        if (event?.data?.id) {
          privy.embeddedWallet.onMessage(event.data);
        }
      });

      console.log('Privy initialized and iframe communication setup');
    } else {
      console.error('Failed to access iframe contentWindow');
    }
  };

  // Provide Privy globally
  nuxtApp.provide('privy', privy);

  console.log('Privy initialized and provided globally');
});
