import dev from '../config/development';
import local from '../config/local';
import prod from '../config/production';
import stg from '../config/staging';
import type { PaginationConfig, TableFilters } from '../types/config';
import { CACHE_EXPIRATION_IN_MS, ON_CLICK_OPEN, PageSize, PAGINATION_LIMIT } from '../values/general.values';

export function getAppConfig(env?: string) {
  const configFile = env === 'staging' ? stg : env === 'development' ? dev : env === 'local' ? local : prod;
  return {
    ...configFile,
    ENV: env,
  };
}

/**
 * OG data
 */
export function prepareOG(
  title = 'Social Oracle - A decentralized prediction market platform where users can bet on real world social events.',
  description = 'Social Oracle is a decentralized prediction market platform where users can bet on real world social events.',
  image = 'https://app.socialoracle.xyz/og.png',
  url = 'https://app.socialoracle.xyz/'
) {
  return {
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    ogImage: image,
    twitterImage: image,
    ogUrl: url,
  };
}

/**
 * Cache expiration
 */
export function isCacheExpired(key: string) {
  const timestamp = sessionStorage.getItem(key);
  if (timestamp) {
    return parseInt(timestamp) + CACHE_EXPIRATION_IN_MS < Date.now();
  }
  return true;
}

/** Parse base method argument to request params */
export function parseArguments(args: FetchParams): Record<string, Parameter> {
  const otherArgs = Object.assign({}, args) as Record<string, Parameter>;
  delete otherArgs.sorter;

  return {
    ...otherArgs,
    page: args?.page || 1,
    limit: args?.limit || PAGINATION_LIMIT,
    orderBy: args?.sorter?.columnKey || 'createTime',
    desc: args?.sorter?.order === 'descend' || !args?.sorter?.columnKey ? 'true' : 'false',
  };
}

export function syncFilters(filters: TableFilters, args: FetchParams) {
  Object.entries(args).forEach(([key, value]) => {
    if (key in filters) {
      filters[key].value = value;
    }
  });
  Object.entries(filters).forEach(([key, filter]) => {
    if (filter.value && !(key in args)) {
      args[key] = filter.value;
    }
  });
}

/** Check if any of elements contains class ${ON_CLICK_OPEN}, which means this column is clickable */
export function canOpenColumnCell(path: EventTarget[]) {
  return path.some(
    (item: EventTarget) =>
      (item as HTMLElement).tagName !== 'svg' && (item as HTMLElement)?.className?.includes(ON_CLICK_OPEN)
  );
}

const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
  );
};
export default json;

/**
 * Enum
 */
export function enumKeys(E: any): string[] {
  return Object.keys(E).filter(k => isNaN(Number(k)));
}
export function enumValues(E: any): string[] | number[] {
  return enumKeys(E).map(k => E[k as any]);
}
export function enumKeyValues(E: any): KeyValue[] {
  return enumKeys(E).map(k => {
    return { key: k, label: k, value: E[k as any] };
  });
}

export function createPagination(remote = true): PaginationConfig {
  const { t } = useI18n();
  return {
    itemCount: remote ? 0 : undefined,
    page: remote ? 1 : undefined,
    pageSize: PAGINATION_LIMIT,
    showSizePicker: true,
    pageSizes: enumValues(PageSize) as number[],
    prefix({ itemCount }) {
      return t('general.total', { total: itemCount });
    },
  };
}

export function downloadURI(uri: string, name: string) {
  let link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
