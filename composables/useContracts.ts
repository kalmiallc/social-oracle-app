import { useClient } from '@wagmi/vue';
import type { Address } from 'viem';
import { getContract } from 'viem';
import { ContractType, getContractAbi } from '~/lib/config/contracts';

const contracts = reactive<{ [key: string]: any }>({});

export default function useContracts() {
  const config = useRuntimeConfig();
  const publicClient = useClient();
  const userStore = useUserStore();

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

    // if (!userStore.walletClient) {
    //   throw new Error('Wallet client not available!');
    // }

    const address = contractAddress || getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in contracts)) {
      contracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: {
          wallet: userStore.walletClient,
          public: publicClient.value,
        },
      });
    }

    return contracts[address];
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

      case ContractType.ORACLE:
        return config.public.ORACLE_CONTRACT as Address;
    }

    return undefined;
  }

  return {
    contracts,
    initContract,
    getContractAddress,
    resetContracts,
  };
}
