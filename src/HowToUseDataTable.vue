<script lang="ts" setup>
import { ref } from "vue";
import {
  DataTable,
  type Header,
  type LoadResponse,
} from "@/components/datatable";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  service: {
    type: Object,
    required: true,
  },
  header: {
    type: Array as () => Header[],
    default: () => [],
  },
});
const emits = defineEmits(["delete", "add", "edit", "deleted"]);

const table = ref();

const onAdd = (): void => {
  emits("add");
 
};

const onEdit = (entity: any): void => {
  emits("edit", entity);
};

const onDelete = (entity: any): void => {
  emits("delete", entity);
};

const reload = (): void => {
  table.value?.loadContent();
};

    /** load table data */
const loadData = (
  page: number,
  size: number,
  sort: string,
  ascending: boolean,
  search: string,
): Promise<LoadResponse> =>
  props.service
    .getPage(page, size, sort, ascending, search)
    .then((page) => ({ total: page.totalElements, rows: page.content }))
    .catch((error) => {
      console.log("Fehler beim Laden der Stammdaten...");
      throw error;
    });

const tableHeader = ref([
  {
    field: "name",
    label: "Name",
  },
  ...props.header,
] as Header[]);
</script>

<template>
  <DataTable
    v-bind="$attrs"
    ref="table"
    :header="tableHeader"
    :load="loadData"
    paginated
    searchable
    configurable
    customColumns>
    <template #nav>
      <o-button
        variant="primary"
        :aria-label="`${label} hinzufügen`"
        :label="`${label} hinzufügen`"
        @click="onAdd()" />
    </template>

    <template #after>
      <o-table-column
        :tdAttrs="() => ({ class: 'text-end' })"
        width="160px"
        v-slot="{ row }">
        <slot name="buttons" :row="row" />
         <o-tooltip :label="`${label} Öffnen`">
          <a :aria-label="`${label} Öffnen`">
            <o-icon
              icon="search"
              size="medium"
              class="ms-2 clickable"
              @click="onEdit(row, false)" />
          </a>
        </o-tooltip>
        <o-tooltip  :label="`${label} Löschen`">
          <a :aria-label="`${label} Löschen`">
            <o-icon
              icon="trash"
              size="medium"
              class="ms-2 hover-danger clickable"
              @click="onDelete([row])" />
          </a>
        </o-tooltip>
      </o-table-column>
    </template>
  </DataTable>
</template>
