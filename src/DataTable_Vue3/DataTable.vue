<template>
  <div class="dt-container" v-if="options">
    <template v-if="loading">
      <div class="dt-info dt-loading">Loading DataTable...</div>
    </template>

    <template v-else>
      <div class="dt-top">
        <h1 class="dt-title">{{ title }}</h1>
        <search class="dt-search" :value="search" @search="searchHandler" />
      </div>
      <table class="dt-table dataTable">
        <thead class="dt-head" v-if="options.header">
          <tr>
            <template v-for="(item, index) in options.header">
              <th
                v-if="item.value != options.groupedBy"
                class="th"
                :key="index"
                :class="{
                  sortable: item.sortable,
                  'order-asc': item.value == sort.key && sort.dir == 'asc',
                  'order-desc': item.value == sort.key && sort.dir == 'desc',
                }"
                @click="item.sortable ? changeSort(item.value) : ''"
              >
                {{ item.text }}
              </th>
            </template>
            <th v-if="options.actions && options.actions.length" class="th">
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="options.rows && options.rows.length > 0">
          <template v-for="(row, rindex) in options.rows">
            <template v-if="isGroupLabel(rindex)">
              <tr class="dt-row dt-grouped" :key="rindex" @click="emitClick">
                <td
                  class="dt-cell"
                  :colspan="options.header.length - (options.actions ? 0 : 1)"
                >
                  {{ row[options.groupedBy] }}
                </td>
              </tr>
            </template>
            <tr class="dt-row" :key="rindex">
              <template v-for="(item, hindex) in options.header">
                <td
                  v-if="item.value != options.groupedBy"
                  class="dt-cell"
                  :key="hindex"
                >
                  {{ row[item.value] }}
                </td>
              </template>
              <th
                v-if="options.actions && options.actions.length"
                class="dt-cell"
              >
                <button
                  v-for="(action, i) in options.actions"
                  :key="i"
                  class="btn-action"
                  type="button"
                  @click="action.f(row)"
                  :title="action.title"
                >
                  <i :class="action.icon"></i>
                </button>
              </th>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <tr class="dt-row dt-grouped">
            <td
              class="dt-cell"
              :colspan="
                options.header.length + (options.actions.length ? 1 : 0)
              "
            >
              <div class="dt-empty">DataTable is empty</div>
            </td>
          </tr>
        </tbody>
        <tfoot class="dtfoot"></tfoot>
      </table>
      <div class="dt-bottom">
        <div class="dt-size">
          <label for="size">Show</label>
          <select name="size" v-model="page.size">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <pagination
          class="dt-pagination"
          :page="options.page"
          :pages="Math.ceil(options.total / page.size)"
          @change="changePage"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from "vue";
import Search from "./Search.vue";
import Pagination from "./Pagination.vue";

export const enum Direction {
  Desc = "desc",
  Asc = "asc",
}
export interface Header {
  text: string;
  sortable: boolean;
  value: string;
}

export interface Action {
  title: string;
  icon: string;
  f: Function;
}

export class Options {
  header!: Header[];
  rows!: any[];
  page!: number;
  total!: number;
  searchable!: boolean;
  groupedBy!: string;
  actions!: Action[];
}

export default defineComponent({
  name: "DataTable",
  components: { Search, Pagination },
  props: {
    options: Options,
    title: String,
    loading: Boolean,
  },
  setup(props, context) {
    const page = reactive({ current: 0, size: 10 });
    const sort = reactive({ key: "", dir: Direction.Asc });
    const search = ref("");

    /** fire load function to parent */
    const emitLoad = () => {
      context.emit(
        "load",
        page.current,
        page.size,
        sort.key,
        sort.dir,
        search.value
      );
    };

    const emitClick = (obj) => {
      context.emit("click", obj);
    }

    /** will be called from parent component to refire the load emit */
    const refresh = () => emitLoad();

    /** watch on data change event */
    watchEffect(async () => emitLoad());

    const changePage = (pageIndex: number) => {
      page.current = pageIndex;
    };

    const changeSort = (key: string) => {
      if (sort.key == key) {
        if (sort.dir == Direction.Asc) {
          sort.dir = Direction.Desc;
        } else {
          sort.key = "";
        }
      } else {
        sort.dir = Direction.Asc;
        sort.key = key;
      }
    };

    const searchHandler = (searchValue: string) => {
      page.current = 0;
      search.value = searchValue;
    };

    const isGroupLabel = (index: number) => {
      return (
        props.options?.groupedBy &&
        (index == 0 ||
          (index - 1 > 0 &&
            props.options.rows[index - 1][props.options.groupedBy] !=
              props.options.rows[index][props.options.groupedBy]))
      );
    };

    return {
      page,
      sort,
      search,
      changePage,
      searchHandler,
      changeSort,
      isGroupLabel,
      refresh,
      emitClick,
    };
  },
});
</script>

<style scoped lang="scss">
.dt-loading {
  font-size: 1.5em;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  color: green;
}

.dt-empty {
  color: blue;
  font-size: 1.3em;
  text-align: center;
}

.dt-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;

  .dt-title {
    font-size: 1.3em;
    padding: 5px;
    margin: 0;
  }
}

.dt-table {
  .th {
    &.sortable {
      cursor: pointer;
    }
    &.order-desc:after {
      content: "⬇";
      padding-left: 3px;
    }
    &.order-asc:after {
      content: "⬆";
      padding-left: 3px;
    }
  }

  .dt-row:nth-child(even) {
    background-color: #f2f2f2;
  }

  .dt-cell {
    background: transparent;

    .btn-action {
      color: #666;
      min-width: 16px;
      width: 17px;
      height: 17px !important;
      display: inline-block;
      margin: 0 2px 0 0 !important;
      padding: 0px;
      background-position: top left;
      background-repeat: no-repeat;
      background-color: transparent;
      margin-bottom: 3px;
      cursor: pointer;
      border: 1px solid darkgrey;
      border-radius: 3px;
    }
  }

  .dt-grouped .dt-cell {
    text-align: left;
    background: #dee7f2;
    font-weight: bold;
  }
}

.dt-bottom {
  margin-top: 1em;
  display: flex;
  justify-content: space-between;

  .dt-size {
    font-size: 1.1em;
    padding: 5px;

    label {
      margin-right: 5px;
    }
  }
  .dt-pagination {
    float: right;
  }
}
</style>
