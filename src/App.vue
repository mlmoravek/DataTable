<script lang="ts" setup>
/***************************
 *     HowToUseDatatable
 ****************************/

import { ref } from "vue";
import {
  DataTable,
  type Header,
  type LoadResponse,
} from "@/components/datatable";
import axios, { type AxiosResponse } from "axios";

const emits = defineEmits(["delete", "add", "edit", "deleted"]);
const label = "Beer";
const table = ref();

const onAdd = (): void => {
  alert("On Add");
  emits("add");
};

const onEdit = (entity: any): void => {
  alert("On Edit");
  emits("edit", entity);
};

const onDelete = (entity: any): void => {
  alert("On Delete");
  emits("delete", entity);
};

// reload the table data - internaly it calls the given loadData function
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
  // Make a request to an api using the given parameter
  axios
    .get(`https://api.punkapi.com/v2/beers?page=${page + 1}&per_page=${size}`)
    .then((response: AxiosResponse) => ({ total: 200, rows: response.data }))
    .catch((error) => {
      console.log("Error loading data...");
      throw error;
    });

// define the table columns
const tableHeader = ref([
  {
    field: "name",
    label: "Name",
  },
  {
    field: "first_brewed",
    label: "First Brewed",
  },
  {
    field: "volume.value",
    label: "Volume",
  },
  {
    field: "method",
    label: "Method",
    display: (e) =>
      `${e.mash_temp[0].temp?.value} Mash / ${e.fermentation.temp?.value} Fermentation`,
  },
] as Header[]);
</script>

<template>
  <div class="box m-5">
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
          :aria-label="`Add ${label}`"
          :label="`Add ${label}`"
          @click="onAdd()" />
      </template>

      <template #after>
        <o-table-column
          :tdAttrs="() => ({ class: 'text-end' })"
          width="160px"
          v-slot="{ row }">
          <slot name="buttons" :row="row" />
          <o-tooltip :label="`Open ${label}`">
            <a :aria-label="`Open ${label}`">
              <o-icon
                icon="magnify"
                size="medium"
                class="ms-2 clickable"
                @click="onEdit(row, false)" />
            </a>
          </o-tooltip>
          <o-tooltip :label="`Delete ${label}`">
            <a :aria-label="`Delete ${label}`">
              <o-icon
                icon="delete"
                size="medium"
                class="ms-2 hover-danger clickable"
                @click="onDelete([row])" />
            </a>
          </o-tooltip>
        </o-table-column>
      </template>
    </DataTable>
  </div>
</template>
