<script lang="ts">
// @ is an alias to /src
import { defineComponent, ref, reactive, watch, computed } from "vue";
import DataTable, {
  Header,
  Direction,
  Options,
  Action,
} from "@/components/DataTable/DataTable.vue";
import RestService from "@/service/RestService";
import { DataTable as DataTableModel } from "@/models/Interfaces";
import Detail from "@/components/Detail.vue";

export default defineComponent({
  name: "Table",
  components: {
    DataTable,
    Detail,
  },
  props: {
    path: String,
  },
  setup(props) {
    const service = new RestService("http://localhost:8081" + props.path);
    const data = ref<DataTableModel>();
    const refDataTableComponent = ref(null);
    const tableTitle = ref("");
    const isLoading = ref(true);
    const dataTableOptions = reactive<Options>({
      header: new Array<Header>(),
      rows: new Array<any>(),
      actions: new Array<Action>(),
      page: 0,
      total: 0,
      searchable: false,
      groupedBy: "",
    });
    const detailObject = ref();
    let isCreate = false;

    const fields = computed(() => data.value?.header.columns);

    /** call refresh function from DataTable component */
    const reloadDataTable = () =>
      (refDataTableComponent.value as any)?.refresh();

    const openDetail = (obj: any) => {
      isCreate = false;
      detailObject.value = obj;
    };
    /** save / update object on server */
    const saveObject = (obj: any) => {
      if (obj) {
        console.log("SAVE OBJECT: ", obj);
        if (!isCreate) service.post("/" + obj.id, obj).then(reloadDataTable);
        else service.put("/" + obj.id, obj).then(reloadDataTable);
      }
    };
    /** delete object on server */
    const deleteObject = (obj: any) => {
      if (obj) {
        console.log("DELETE OBJECT: ", obj);
        service.delete("/" + obj.id).then(reloadDataTable);
      }
    };

    /** open detail modal with an empty object */
    const newObject = () => {
      console.log("NEW OBJECT");
      isCreate = true;
      // create new object to fill and set as detailObj
      const obj = dataTableOptions?.header.reduce(
        (o, header) => ({ ...o, [header.value]: "" }),
        {}
      );
      detailObject.value = obj;
    };

    /** load table data */
    function loadTable(
      page: number,
      size: number,
      sortBy: string,
      ordering: string,
      search: string
    ) {
      const url = `/table?page=${page}&size=${size}&sortBy=${sortBy}&ordering=${
        ordering == Direction.Asc
      }&query=${search}`;

      console.log(url);

      isLoading.value = true;
      detailObject.value = undefined;
      service.get(url).then((apiResponse: DataTableModel) => {
        console.log("API RESULT: ", apiResponse);
        data.value = apiResponse;
        isLoading.value = false;
      });
    }

    /** create table options after response from loading table data */
    watch(data as any, (datatable: DataTableModel) => {
      // set title
      tableTitle.value = datatable.header.tablename;
      // create table header
      dataTableOptions.header = new Array<Header>();
      datatable.header.columns.forEach((head) => {
        dataTableOptions.header.push({
          text: head.name,
          sortable: head.sortable,
          value: head.key,
        });
      });
      // set other options
      dataTableOptions.rows = datatable.results;
      dataTableOptions.searchable = datatable.header.searchable;
      dataTableOptions.page = datatable.page.number;
      dataTableOptions.total = datatable.page.totalElements;

      dataTableOptions.groupedBy = datatable.header.groupedByColumn
        ? datatable.header.groupedByColumn.key
        : "";

      // add actions
      dataTableOptions.actions = new Array<Action>();
      dataTableOptions.actions.push({
        title: "Deteil",
        icon: "fas fa-info",
        f: openDetail,
      });
      dataTableOptions.actions.push({
        title: "Delete",
        icon: "far fa-trash-alt",
        f: deleteObject,
      });
    });

    return {
      dataTableOptions,
      loadTable,
      tableTitle,
      isLoading,
      detailObject,
      fields,
      saveObject,
      deleteObject,
      newObject,
      refDataTableComponent,
    };
  },
});
</script>

<template>
  <div class="table-component">
    <div class="buttons">
      <button type="button" @click="newObject">
        New
      </button>
    </div>
    <DataTable
      ref="refDataTableComponent"
      :title="tableTitle"
      :options="dataTableOptions"
      @load="loadTable"
      :loading="isLoading"
    ></DataTable>
  </div>
  <detail
    title="Detail Object"
    :obj="detailObject"
    :fields="fields"
    @save="saveObject"
    @delete="deleteObject"
  />
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  margin-bottom: 1em;
  button {
    float: unset;
  }
}
</style>
