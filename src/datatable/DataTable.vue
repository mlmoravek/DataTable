<template>
  <article class="datatable">
    <TableNavigation
      :header="header"
      :actions="actions"
      :searchable="searchable"
      :configurable="configurable"
      v-model:columnVisibility="columnVisibility"
      v-model:searchValue="search"
      @search="onSearch"
      @action="doAction">
      <!-- pass slots down -->
      <template v-for="(index, name) in $slots" v-slot:[name]>
        <slot :name="name" />
      </template>
    </TableNavigation>

    <o-table
      v-bind="$attrs"
      ref="tableRef"
      :data="content.rows"
      :columns="customColumns ? [] : columns"
      custom-row-key="id"
      :row-class="rowClassFunction"
      hoverable
      striped
      :checkable="(actions != null && actions.length > 0) || checkable"
      v-model:checked-rows="checkedRows"
      :custom-is-checked="(a: any, b: any) => a.id == b.id"
      :detailed="detailed"
      detail-transition="fade"
      detail-key="id"
      :show-detail-icon="showDetailIcon"
      :paginated="paginated"
      :backend-pagination="isAsync"
      :backend-filtering="isAsync"
      :debounceSearch="800"
      :total="content.total"
      :per-page="paginated ? page.size : content.total"
      :current-page="page.size < content.rows.length ? page.current + 1 : 1"
      :backend-sorting="isAsync"
      :default-sort="[sort.key, sort.dir]"
      @page-change="onPageChange"
      @sort="onSort"
      @click="onClick"
      @filtersChange="onFilterChange"
      wrapperClass="table-wrapper">
      <!-- Pagination Slot -->
      <template v-slot:pagination>
        <TablePagination
          v-model:size="page.size"
          v-model:page="page.current"
          :total="content.total"
          @change="onPageChange">
          <!-- pass slots down -->
          <template v-for="(index, name) in $slots" v-slot:[name]>
            <slot :name="name" />
          </template>
        </TablePagination>
      </template>
      <!-- Default Slot -->
      <template v-if="customColumns || $slots.default">
        <slot>
          <slot name="before" />
          <o-table-column
            v-for="column in columns"
            :key="column.field"
            v-bind="column"
            custom-key="id">
            <template v-slot="{ row }">
              {{ row[column.field] }}
            </template>
            <template #searchable="props" v-if="column.filterable">
              <o-input
                v-model="props.filters[column.field]"
                :placeholder="config.filterPlaceholder"
                :icon="config.filterIcon"
                size="small"
                type="search" />
            </template>
          </o-table-column>
          <slot name="after" />
        </slot>
      </template>
      <!-- Detail Slot -->
      <template #detail="{ row, index }">
        <slot name="detail" :row="row.__dataObject" :index="index" />
      </template>
      <!-- Footer Slot -->
      <template #footer>
        <slot name="footer" />
      </template>
      <!-- Empty Slot -->
      <template #empty>
        <slot name="empty" v-if="!(loading || isLoading)">
          <section class="section empty">
            <p>
              <o-icon :icon="config.emptyIcon" size="is-large" />
              {{ config.emptyLabel }}
            </p>
          </section>
        </slot>
      </template>
      <template #loading>
        <slot name="loading">
          <o-loading
            :active="loading || isLoading"
            :full-page="false"
            iconClass="is-primary"
            :icon="config.loadingIcon"
            iconSize="large"
            role="status"
            aria-hidden="true" />
        </slot>
      </template>
    </o-table>
  </article>
</template>

<script lang="ts">
/** See Oruga documentation https://oruga.io/components/Table.html */
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
  type PropType,
  type VNode,
} from "vue";
import { useConfig } from "./config";
import TableNavigation from "./TableNavigation.vue";
import TablePagination from "./TablePagination.vue";
import type { Action, Header, LoadFunction, TableRow } from "./types";

const config = useConfig();

/**
 * @Emits rowClick event if an row is clicked
 * @Emits checkedRows if an row check change
 * @Emits visibilityChange if the visibilty for a row change
 * @Emits search if the search is triggered
 * @Emits sort if the sort is triggered
 * @Slot default default table slot
 * @Slot func for further functionality in the nav bar
 * @Slot footer table footer slot
 *
 * Also all further props and events will be passed to the oruga-table component,
 * so all props and events of the table component can be used.
 */
export default defineComponent({
  components: { TableNavigation, TablePagination },
  props: {
    /** Define the columns with this header property. If not given the inline b-table-column variation is used. */
    header: { type: Array as () => Array<Header> },
    /** If no data prop is set, this load function is called every time the data should be updated. */
    load: { type: Function as PropType<LoadFunction> },
    /** As alternativ to the async load function, a sync data object can be set. */
    data: { type: Array },
    /** Dis/Enable the searchbar */
    searchable: { type: Boolean, default: false },
    /** dis/enable a checkbox for every row */
    checkable: { type: Boolean, default: false },
    /** Dis/Enable the paginations bar */
    paginated: { type: Boolean, default: false },
    /** Dis/Enable the detail slot */
    detailed: { type: Boolean, default: false },
    /** adds class is-clickable to any row */
    clickable: { type: Boolean, default: false },
    /** Dis/Enable config options */
    configurable: { type: Boolean, default: false },
    /** Dis/Enable custom columns instead of o-table-columns */
    customColumns: { type: Boolean, default: false },
    /** Actions for checked rows */
    actions: {
      type: Array as () => Array<Action>,
      default: () => [],
    },
    defaultPage: { type: Number, default: 0 },
    defaultSort: { type: String, default: "id" },
    defaultSortDirection: {
      type: String,
      validator: (value: string) => ["asc", "desc"].includes(value),
      default: "asc",
    },
    /** Override loading state */
    loading: { type: Boolean },
    /** Override for show-detail-icon from oruga table.
     if false the click event will trigger open detail */
    showDetailIcon: { type: Boolean, default: true },
    /** Add a class to a row based on the return	 */
    rowClass: {
      type: Function as PropType<(row: TableRow, index: number) => string>,
    },
    /** Define the unique primary key field for the row element */
    rowKey: { type: String, default: "id" },
    // and all props from oruga table possible
  },
  emits: [
    "rowClick",
    "checkedRows",
    "visibilityChange",
    "search",
    "filter",
    "sort",
    "page",
  ],
  setup(props, ctx) {
    const tableRef = ref();
    const isLoading = ref(false);

    const page = reactive({
      current: props.defaultPage,
      size: 10,
    });
    const sort = reactive({
      key: props.defaultSort,
      dir: props.defaultSortDirection,
    });
    const content = reactive({
      rows: Array<TableRow>(),
      total: 0,
    });
    const search = ref("");
    const filters = ref<Record<string, string>>({});
    const checkedRows = ref([]);
    const columnVisibility = ref({} as { [column: string]: boolean });

    const columns = computed((): Header[] => {
      // filter the columns in header if they should shown
      return (
        props.header?.map((h: Header) => {
          const visible = columnVisibility.value[h.field];
          h.visible = visible === undefined ? !h.optional : visible;
          return h;
        }) || []
      );
    });

    const isAsync = computed(() => typeof props.data === "undefined");

    watch(
      [
        () => props.header,
        () => props.data,
        () => ({ ...page, ...sort, ...filters.value }),
      ],
      () => loadContent(),
    );

    watch(checkedRows, (rows) => ctx.emit("checkedRows", rows));
    watch(
      () => props.header,
      () => setColumnVisibility(),
    );
    watch(
      () => columnVisibility,
      () => {
        // emit visibility change event
        ctx.emit("visibilityChange", columnVisibility);
        // set costum column visabiltiy based on columnVisibility
        setCustomColumnVisability();
      },
    );

    /**
     * Internal function to load data. Use Data Prop or else loadFunc Prop if given.
     * This function can be called from outside to trigger load event.
     **/
    const loadContent = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (props.data) {
          // load content from data prop
          content.rows = props.data.map(formatRow);
          content.total = props.data.length;
          resolve();
        } else if (typeof props.load === "function") {
          // else call load function to fetch data async
          isLoading.value = true;
          props
            .load(
              page.current,
              page.size,
              sort.key,
              sort.dir == "asc",
              search.value,
              filters.value,
            )
            .then((data: { rows: TableRow[]; total: number }) => {
              if (!data || !data.rows) return;
              // transforms cells via display property in header settings
              content.rows = data.rows.map(formatRow);
              content.total = props.paginated ? data.total : data.rows.length;
              resolve();
            })
            .catch((e) => reject(e))
            .finally(() => (isLoading.value = false));
        } else {
          reject("Either prop 'data' or 'loadFunc' must be given.");
        }
      });
    };

    /** Create tableRow object and transforms cells via display property in header settings */
    const formatRow = (row: any): TableRow => {
      const tableRow: TableRow = {
        __dataObject: row,
        id: row[props.rowKey],
      };
      for (const header of props.header || []) {
        let prop = row[header.field];
        if (header.field?.includes(".")) {
          // override prop with deep value
          prop = row;
          const arr = header.field.split(".");
          while (arr.length && (prop = prop[arr.shift() as string]));
        }
        tableRow[header.field] = header.display
          ? header.display(prop, row)
          : prop;
      }
      return tableRow;
    };

    /** set the columnVisibility object based on the header property */
    const setColumnVisibility = (): void => {
      columnVisibility.value =
        props.header?.reduce(
          (obj: Header, h: Header) => ({ ...obj, [h.field]: !h.optional }),
          {} as Header,
        ) || {};
      setCustomColumnVisability();
    };

    /** set the visability for custom columns based on header visability if activated */
    const setCustomColumnVisability = (): void => {
      // check defaultSlot o-table-columns and set the visablity there if options.customColumns is activated
      if (props.customColumns && ctx.slots.default) {
        const defaultSlots = ctx.slots.default();
        (defaultSlots as Array<VNode>).forEach((column: any) => {
          // check if column is included in visible columns
          const visible = columns.value.some(
            (column: Header) =>
              column.props.field && column.field == column.props.field,
          );
          // and always show columns which are no listed in header
          const notInHeader = props.header?.some(
            (h: Header) => h.field != column.props.field,
          );
          // create props object if not exist
          if (!column.props) column.props = {};
          // set column visible property
          if (notInHeader && column.props.visible == undefined)
            column.props.visible = true;
          else if (!notInHeader) column.props.visible = visible;
        });
      }
    };

    /** emit click event */
    const onClick = (obj: any): void => {
      // open detail if detailed is activated and the detail icon isn't shown
      if (props.detailed && !props.showDetailIcon)
        tableRef.value.toggleDetails(obj);

      // emit click event
      ctx.emit("rowClick", obj.__dataObject);
    };

    /** handle search value change event */
    const onSearch = (searchValue: string): void => {
      page.current = 0;
      ctx.emit("search", searchValue);
      loadContent();
    };

    /** Handle page-change event */
    const onPageChange = (pageNumber: number): void => {
      page.current = pageNumber;
      ctx.emit("page", page);
    };

    /** Handle sort event */
    const onSort = (field: string, order: string): void => {
      sort.dir = order;
      sort.key = field;
      ctx.emit("sort", sort);
    };

    /** Handle filter event */
    const onFilterChange = (filtersRecord: Record<string, string>): void => {
      filters.value = filtersRecord;
      ctx.emit("filter", filters.value);
    };

    /** handle action event */
    const doAction = (action: Action): void => {
      action.f(checkedRows.value).then(() => (checkedRows.value = []));
    };

    /** the row-class function add classed to any row from the table */
    const rowClassFunction = (row: TableRow, index: number): string => {
      let classStr = "";
      if ((props.detailed && !props.showDetailIcon) || props.clickable)
        classStr += "is-clickable ";
      if (props.rowClass) classStr += props.rowClass(row, index);
      return classStr;
    };

    // instanziate columnVisibility object
    setColumnVisibility();
    // emit first load
    loadContent();

    return {
      tableRef,
      isAsync,
      search,
      isLoading,
      page,
      sort,
      filters,
      content,
      checkedRows,
      columns,
      columnVisibility,
      rowClassFunction,
      doAction,
      onClick,
      onPageChange,
      onSearch,
      loadContent,
      onSort,
      onFilterChange,
      config,
    };
  },
});
</script>

<style lang="scss" scoped>
.datatable {
  width: 100%;

  :deep(.is-primary) {
    color: $primary;
  }

  .section.empty {
    text-align: center;
    padding: 3rem 0;

    .icon {
      margin-right: 0.5em;
    }
  }

  table thead tr th:empty {
    padding: 0;
  }

  :deep(.table tfoot th:empty) {
    border-bottom: unset;
  }
}
</style>
