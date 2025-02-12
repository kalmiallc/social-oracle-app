// plugins/privy.client.ts
import { defineNuxtPlugin } from '#app';
import { LocalStorage } from '@privy-io/js-sdk-core';
import Privy from '@privy-io/js-sdk-core';

export default defineNuxtPlugin(nuxtApp => {
  if (import.meta.server) return;

  // Initialize the Privy client
  const privy = new Privy({
    appId: 'cm727ky1m033zu15ipe6wx6tx',
    storage: new LocalStorage(),
  });

  // Create and append the iframe
  const iframeUrl = privy.embeddedWallet.getURL(); // This is synchronous
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  // iframe.style.display = 'none'; // Hide iframe if needed
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

  // // Ensure contentWindow is available before calling setMessagePoster
  // iframe.onload = () => {
  //   if (iframe.contentWindow) {
  //     privy.setMessagePoster(iframe.contentWindow as any);
  //     console.log('Privy iframe communication setup completed');
  //   } else {
  //     console.error('Failed to access iframe contentWindow');
  //   }
  // };

  // Provide Privy globally
  nuxtApp.provide('privy', privy);

  console.log('Privy initialized and provided globally');
});
