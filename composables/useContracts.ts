import { useChainId, useChains, useClient, useConnectorClient, useSwitchChain } from '@wagmi/vue';
import type { Address, Client, Transport, Chain, Account } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { Chains } from '~/lib/types/asset';
import { ContractType, getContractAbi } from '~/lib/config/contracts';

const contracts = reactive<{ [key: string]: any }>({});
const readContracts = reactive<{ [key: string]: any }>({});
const publicClients = reactive<Record<number, Client<Transport, Chain | undefined, Account | undefined>>>({});

export default function useContracts() {
  const config = useRuntimeConfig();
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();

  const publicClient = useClient();
  const { data: walletClient, refetch } = useConnectorClient();

  const activeChain = computed(() => chains.value.find(chain => chain.id === chainId.value)) || chains[0];

  function initPublicClients() {
    chains.value.forEach(chain => {
      if (!(chain.id in publicClients)) {
        publicClients[chain.id] = createPublicClient({
          chain,
          transport: http(),
        });
      }
    });
  }

  function getPublicClient(id: number) {
    if (!(id in publicClients)) {
      initPublicClients();
    }
    return publicClients[id];
  }

  /**
   *
   * @param contractType
   * @param chainId
   * @param contractAddress
   * @returns
   */
  async function getReadContract(contractType: ContractType, chainId: number, contractAddress?: Address) {
    if (contractType === ContractType.FPMM && !contractAddress) {
      throw new Error('FPMM contract address must be provided!');
    }

    const address = contractAddress || getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in readContracts)) {
      readContracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: getPublicClient(chainId),
      });
    }

    return readContracts[address];
  }

  /**
   *
   * @param contractType
   * @param contractAddress
   * @returns
   */
  async function initContract(contractType: ContractType, contractAddress?: Address) {
    if (contractType === ContractType.FPMM && !contractAddress) {
      throw new Error('FPMM contract address must be provided!');
    }

    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }

    if (!walletClient.value) {
      throw new Error('Wallet client not available!');
    }

    const address = contractAddress || getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in contracts)) {
      contracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: {
          wallet: walletClient.value,
          public: publicClient.value,
        },
      });
    }

    return contracts[address];
  }

  /**
   *
   * @param retry
   */
  async function ensureCorrectNetwork(retry: number = 0) {
    const desiredChainId = chains.value[0].id;

    switchChain({ chainId: desiredChainId });
    await sleep(100);
    await refetch();
    await sleep(100);

    if (desiredChainId !== chainId.value) {
      if (retry > 5) {
        throw new Error('Failed to switch chain!');
      }
      await sleep(100);
      await ensureCorrectNetwork(retry + 1);
    }
  }

  function resetContracts() {
    Object.keys(contracts).forEach(key => {
      delete contracts[key];
    });
  }

  function getContractAddress(type: ContractType): Address | undefined {
    switch (type) {
      case ContractType.CONDITIONAL_TOKEN:
        return config.public.CONDITIONAL_TOKEN_CONTRACT as Address;

      case ContractType.COLLATERAL_TOKEN:
        return config.public.COLLATERAL_TOKEN_CONTRACT as Address;
    }

    return undefined;
  }

  return {
    contracts,
    activeChain,
    initContract,
    ensureCorrectNetwork,
    getContractAddress,
    getPublicClient,
    getReadContract,
    resetContracts,
  };
}
