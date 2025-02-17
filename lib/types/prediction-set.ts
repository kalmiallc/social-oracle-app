import type { Address } from 'viem';

/**
 * Prediction set status.
 */
export enum PredictionSetStatus {
  INITIALIZED = 1,
  PENDING = 2,
  FUNDING = 3,
  ACTIVE = 4,
  VOTING = 5,
  FINALIZED = 6,
  ERROR = 7,
}

/**
 * Prediction set resolution type.
 */
export enum ResolutionType {
  AUTOMATIC = 1,
  MANUAL = 2,
}

/**
 * Prediction set transaction type.
 */
export enum TransactionType {
  BUY = 1,
  SELL = 2,
  FUND = 3,
}

export interface PredictionSetResponse extends GeneralResponse<PredictionSetInterface> {}
export interface PredictionSetsResponse extends GeneralItemsResponse<any> {}

export interface PredictionSetInterface extends GeneralInterface {
  winner_outcome_id: number;
  setId: string;
  question: string;
  description: string;
  generalResolutionDef: string;
  outcomeResolutionDef: string;
  outcomePriceDef: string;
  startTime: Date;
  endTime: Date;
  resolutionTime: Date;
  resolutionType: ResolutionType;
  consensusThreshold: number;
  setStatus: PredictionSetStatus;
  outcomes: OutcomeInterface[];
  chainData: ChainDataInterface;
  imgUrl: string;
}

export interface OutcomeInterface extends GeneralInterface {
  outcomeIndex: number;
  positionId: string;
  name: string;
  latestChance: OutcomeChance;
  imgUrl: string;
}

export interface ChainDataInterface extends GeneralInterface {
  questionId: string;
  conditionId: string;
  txHash: string;
  contractAddress: Address;
  lastProcessedBlock: number;
  parseBlockSize: number;
}

export interface OutcomeChance extends GeneralInterface {
  chance: number;
  supply: number;
  totalSupply: number;
}
