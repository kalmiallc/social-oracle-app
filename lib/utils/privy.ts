import { LocalStorage } from '@privy-io/js-sdk-core';
import Privy from '@privy-io/js-sdk-core';

// Initialize the Privy client with your Privy app ID and storage interface
export const $privy = new Privy({
  appId: 'insert-your-privy-app-id',
  storage: new LocalStorage(),
});
