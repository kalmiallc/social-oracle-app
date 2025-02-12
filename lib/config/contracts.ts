import { COLLATERAL_TOKEN_ABI, CONDITIONAL_TOKEN_ABI, FPMM_ABI } from './abi';

/**
 * Contract types.
 */
export enum ContractType {
  CONDITIONAL_TOKEN = 1,
  COLLATERAL_TOKEN = 2,
  FPMM = 3,
}

/**
 * Gets contract ABI based on contract type.
 * @param contractType Contract type.
 * @returns Contract ABI.
 */
export function getContractAbi(contractType: ContractType): any {
  switch (contractType) {
    case ContractType.CONDITIONAL_TOKEN:
      return CONDITIONAL_TOKEN_ABI;

    case ContractType.COLLATERAL_TOKEN:
      return COLLATERAL_TOKEN_ABI;

    case ContractType.FPMM:
      return FPMM_ABI;
    default:
      return null;
  }
}
