import { defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';

export function getChain() {
  const config = useRuntimeConfig();

  return baseSepolia;

  if (['local', 'development', 'staging'].includes(config.public.ENV)) {
    return defineChain({
      id: 123420111,
      name: 'OP Celestia Raspberry',
      nativeCurrency: {
        decimals: 18,
        name: 'Sepolia Ether',
        symbol: 'ETH',
      },
      rpcUrls: {
        default: {
          http: ['https://rpc.opcelestia-raspberry.gelato.digital'],
          webSocket: ['wss://ws.opcelestia-raspberry.gelato.digital'],
        },
      },
      blockExplorers: {
        default: { name: 'OP Celestia Raspberry explorer', url: 'https://opcelestia-raspberry.gelatoscout.com' },
      },
    });
  } else {
    return baseSepolia;
  }
}
