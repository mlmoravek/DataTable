import DataTable from "./DataTable.vue";
import TableNavigation from "./TableNavigation.vue";
import TablePagination from "./TablePagination.vue";
import { setConfig, useConfig } from "./config";

import type {
  Action,
  Header,
  LoadFunction,
  LoadResponse,
  Config,
} from "./types";

export type { LoadFunction, LoadResponse, Action, Header };
export { DataTable, TableNavigation, TablePagination, setConfig };

import type { App } from "vue";

export default {
  install: (app: App, options: Config): void => {
    setConfig(Object.assign(useConfig(), options));

    // add datatable component
    app.component("datatable", DataTable);
  },
};
