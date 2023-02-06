import { ref } from "vue";
import type { Config } from "./types";

const config = ref<Config>({
  columnEditIcon: "tune",
  columnEditLabel: "Column configuration",
  columnEditHeader: "Displayed columns:",
  actionIcon: "play",
  actionPlaceholder: "Select action",
  actionLabel: "Execute action",
  searchIcon: "magnify",
  searchPlaceholder: "Search...",
  searchLabel: "Search",
  filterIcon: "magnify",
  filterPlaceholder: "Filter...",

  sizes: [5, 10, 20, 50, 100],
  sizesLabel: "Entries per page",

  pageNextLabel: "Next page",
  pagePreviousLabel: "Previous page",
  pageLabel: "Page",
  pageCurrentLabel: "Current page",

  emptyIcon: "frown",
  emptyLabel: "Unfortunately no information available...",

  loadingIcon: "loading",
});

export function setConfig(options: Config): void {
  config.value = options;
}

export function useConfig(): Config {
  return config.value;
}
