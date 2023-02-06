import { ref } from "vue";
import type { Config } from "./types";

const config = ref<Config>({
  columnEditIcon: "sliders",
  columnEditLabel: "Spaltenkonfiguration",
  columnEditHeader: "Angezeigte Spalten:",
  actionIcon: "play",
  actionPlaceholder: "Aktion auswählen",
  actionLabel: "Aktion ausführen",
  searchIcon: "magnifying-glass",
  searchPlaceholder: "Suchen...",
  searchLabel: "Suchen",
  filterIcon: "magnifying-glass",
  filterPlaceholder: "Filter...",

  sizes: [5, 10, 20, 50, 100],
  sizesLabel: "Einträge pro Seite",

  pageNextLabel: "Nächste Seite",
  pagePreviousLabel: "Vorherige Seite",
  pageLabel: "Seite",
  pageCurrentLabel: "Aktuelle Seite",

  emptyIcon: "frown",
  emptyLabel: "Leider keine Informationen vorhanden...",

  loadingIcon: "spinner",
});

export function setConfig(options: Config): void {
  config.value = options;
}

export function useConfig(): Config {
  return config.value;
}
