export interface Config {
  columnEditIcon: string;
  columnEditLabel: string;
  columnEditHeader: string;
  actionIcon: string;
  actionPlaceholder: string;
  actionLabel: string;
  searchIcon: string;
  searchPlaceholder: string;
  searchLabel: string;
  filterIcon: string;
  filterPlaceholder: string;

  sizes: number[];
  sizesLabel: string;

  pageNextLabel: string;
  pagePreviousLabel: string;
  pageLabel: string;
  pageCurrentLabel: string;

  emptyIcon: string;
  emptyLabel: string;

  loadingIcon: string;
}

export interface Header {
  /** object property key as field key */
  field: string;
  /** label for the column */
  label: string;
  /** if the column is sortable */
  sortable?: boolean;
  /** if the column has a filter */
  filterable?: boolean;
  /** if optional the columns isn't shown directy but can be activated */
  optional?: boolean;
  /** display function to edit output */
  display?: (value: any, row: any) => string;
  // all props from oruga table column are also possible
  [key: string]: any;
  // https://oruga.io/components/Table.html#props
}

export type ActionFunction = (rows: any[]) => Promise<void>;

export interface Action {
  /** action title shown in dropdown */
  title: string;
  /** function to be called if the action is fired, with all selected rows as property */
  f: ActionFunction;
}

export interface LoadResponse {
  rows: any[];
  total: number;
}

export type LoadFunction = (
  page: number,
  size: number,
  sort: string,
  ascending: boolean,
  search: string,
  filters: Record<string, string>,
) => Promise<LoadResponse>;

export interface TableRow {
  __dataObject: any;
  id: any;
  [key: string]: any;
}
