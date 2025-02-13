import type { DataTableSortState, SelectOption } from 'naive-ui';
import type { Address } from 'viem';

export enum AppEnv {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development',
  LOCAL = 'local',
}

export type TableFilter = {
  options?: SelectOption[];
  show: boolean;
  value: string | number | null;
};

export type TableFilters = Record<string, TableFilter>;

export type PaginationConfig = {
  itemCount: number | undefined;
  page: number | undefined;
  pageSize: number;
  showSizePicker: boolean;
  pageSizes: number[];
  prefix: (args: { itemCount: number | undefined }) => string;
};

export type BaseStore<ListItem, Item = void> = {
  active?: Item;
  filters?: TableFilters;
  items: Array<ListItem>;
  loading?: boolean;
  pagination: PaginationConfig;
  sorter?: DataTableSortState | null;
  fetch: Function;
} & Record<string, any>;

declare global {
  interface ConfigInterface {
    ENV?: string;
    VERSION: string;
    url: string;
    apiUrl: string;

    CHAIN_ID: number;
    COLLATERAL_TOKEN_CONTRACT: Address;
    CONDITIONAL_TOKEN_CONTRACT: Address;
    FPMM_FACTORY_CONTRACT: Address;
    ORACLE_CONTRACT: Address;

    PRIVY_APP_ID: string;
  }
}
