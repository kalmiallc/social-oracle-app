<template>
  <div class="card !px-6 !pt-8">
    <div class="flex-bc mb-4">
      <h2>{{ title }}</h2>
      <div class="flex-cc gap-4">
        <FormInputSearch
          v-if="store?.filters?.search"
          v-model:value="store.filters.search.value"
          class="min-w-32 w-[12vw] max-w-xs"
        />
        <TableFilters v-if="store?.filters" :filters="store.filters" :loading="store.loading" />
        <TableSwitch v-model:value="showGrid" />
      </div>
    </div>
    <div v-if="showGrid && store.items.length === 0" class="w-full bg-bg-light p-6 mb-4 text-center">
      <n-empty description="No data" />
    </div>
    <div v-else-if="showGrid" class="grid grid-cols-billing gap-2 bg-bg pt-2 -mx-6 -mb-2">
      <template v-for="item in store.items">
        {{ item }}
      </template>
    </div>
    <n-data-table
      v-else
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="store.items"
      :loading="store.loading"
      :pagination="store.pagination"
      :row-key="row => row.id"
      :row-props="rowProps"
      @update:page="(page: number) => getItems(page, store.pagination.pageSize)"
      @update:page-size="(pageSize: number) => getItems(1, pageSize)"
      @update:sorter="handleSorterChange"
      remote
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableInst, DataTableSortState } from 'naive-ui';
import type { BaseStore } from '~/lib/types/config';
import type { AnyOffer, AnyOfferRequest } from '~/lib/types/offer';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';

const props = defineProps({
  columns: { type: Array as PropType<DataTableColumns<any>>, default: [] },
  rowProps: { type: Object as PropType<any>, default: {} },
  store: { type: Object as PropType<BaseStore<any, any>>, required: true },
  title: { type: String, default: '' },
});

const tableRef = ref<DataTableInst | null>(null);

const search = ref('');
const showGrid = ref<boolean>(false);
const isSearchAvailable = computed(() => props.store?.filters?.search !== undefined);
const filterValues = computed(
  () =>
    Object.values(props.store?.filters || {})
      .filter(filter => filter.show && filter?.options?.length)
      .map(filter => filter.value) || []
);

watch(
  () => filterValues.value,
  _ => {
    getItems();
  }
);
watch(
  () => props.store?.filters?.search?.value || search.value,
  search => {
    if (isSearchAvailable.value && search) {
      debouncedSearchFilter();
    }
  }
);
const debouncedSearchFilter = useDebounceFn(getItems, 500);

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(sorter?: DataTableSortState) {
  props.store.sorter = sorter && sorter.order !== false ? sorter : null;

  if (props.store?.sorter) {
    await getItems(1, PAGINATION_LIMIT);
  } else {
    clearSorter();
  }
}
/** Reset sort if user search change directory or search directory content */
function clearSorter() {
  if (tableRef.value) {
    tableRef.value.sort(0, false);
    props.store.sorter = null;
  }
}

/** On page change, load data */
async function getItems(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!props.store.loading) {
    props.store.pagination.page = page;
    props.store.pagination.pageSize = limit;
    await props.store.fetch({ page, limit, sorter: props.store.sorter });
  }
}
</script>
