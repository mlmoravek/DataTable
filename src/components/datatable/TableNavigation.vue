<template>
  <div class="datatable-nav">
    <div class="datatable-nav-left">
      <slot name="nav-left" />
      <slot name="actions">
        <o-field
          v-if="actions != null && actions.length > 0"
          class="datatable-actions"
          addonsClass="datatable-actions-wrapper">
          <o-select
            v-model="selectedAction"
            :placeholder="actionPlaceholder"
            aria-role="list"
            :aria-label="actionPlaceholder">
            <option
              v-for="(action, index) in actions"
              :key="index"
              :value="action">
              {{ action.title }}
            </option>
          </o-select>
          <o-tooltip :label="actionLabel">
            <o-button
              @click="onAction(selectedAction)"
              :iconLeft="actionIcon"
              aria-role="button"
              :aria-label="actionPlaceholder" />
          </o-tooltip>
        </o-field>
      </slot>
      <slot name="nav" />
    </div>

    <div class="datatable-nav-right">
      <slot name="config">
        <o-field v-if="configurable && visibility" class="datatable-config">
          <o-dropdown
            :triggers="['hover', 'click']"
            aria-role="list"
            position="bottom-left">
            <template #trigger>
              <o-tooltip :label="columnEditLabel">
                <o-button
                  :iconLeft="columnEditIcon"
                  ario-role="button"
                  :aria-label="columnEditLabel" />
              </o-tooltip>
            </template>
            <o-dropdown-item aria-role="listitem" class="config-item">
              {{ columnEditHeader }}
            </o-dropdown-item>
            <o-dropdown-item
              v-for="h of header"
              :key="h.field"
              class="field config-item"
              style="min-width: 17rem"
              aria-role="listitem"
              custom>
              <o-switch v-model="visibility[h.field]">
                {{ h.label }}
              </o-switch>
            </o-dropdown-item>
          </o-dropdown>
        </o-field>
      </slot>

      <slot name="search">
        <o-field v-if="searchable" class="datatable-search" role="search">
          <o-input
            v-model="searchInput"
            type="search"
            name="search"
            :placeholder="searchPlaceholder"
            @keyup.enter="onSearch"
            @update:modelValue="onSearchChange" />
          <o-tooltip :label="searchLabel">
            <o-button
              class="search-button"
              variant="primary"
              :iconLeft="searchIcon"
              @click="onSearch" />
          </o-tooltip>
        </o-field>
      </slot>
      <slot name="nav-right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import type { Action, Header } from "./types";
import { useConfig } from "./config";

const config = useConfig();

export default defineComponent({
  props: {
    /** define the columns with this header property. If not given the inline b-table-column variation is used. */
    header: {
      type: Array as () => Array<Header>,
    },
    actions: {
      type: Array as () => Array<Action>,
    },
    columnVisibility: {
      type: Object as () => { [column: string]: boolean },
    },
    searchValue: {
      type: String,
      default: "",
    },
    actionIcon: {
      type: String,
      default: config.actionIcon,
    },
    actionPlaceholder: {
      type: String,
      default: config.actionPlaceholder,
    },
    actionLabel: {
      type: String,
      default: config.actionLabel,
    },
    configurable: {
      type: Boolean,
      default: false,
    },
    columnEditIcon: {
      type: String,
      default: config.columnEditIcon,
    },
    columnEditLabel: {
      type: String,
      default: config.columnEditLabel,
    },
    columnEditHeader: {
      type: String,
      default: config.columnEditHeader,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    searchIcon: {
      type: String,
      default: config.searchIcon,
    },
    searchPlaceholder: {
      type: String,
      default: config.searchPlaceholder,
    },
    searchLabel: {
      type: String,
      default: config.searchLabel,
    },
  },
  emits: ["update:columnVisibility", "update:searchValue", "search", "action"],
  setup(props, ctx) {
    const search = ref("");
    const selectedAction = ref();

    /** Handle search event */
    const onSearch = (): void => {
      ctx.emit("search", searchInput.value);
    };

    /** Handle search change event */
    const onSearchChange = (value: string): void => {
      if (value === "") {
        searchInput.value = "";
        ctx.emit("search", "");
      }
    };

    /** Handle action event */
    const onAction = (selectedAction: Action): void => {
      ctx.emit("action", selectedAction);
    };

    const visibility = computed<{ [column: string]: boolean }>({
      get() {
        return props.columnVisibility || {};
      },
      set(value: { [column: string]: boolean }) {
        ctx.emit("update:columnVisibility", value);
      },
    });

    const searchInput = computed<string>({
      get() {
        return props.searchValue;
      },
      set(value: string) {
        ctx.emit("update:searchValue", value);
      },
    });

    return {
      search,
      selectedAction,
      searchInput,
      visibility,
      onAction,
      onSearch,
      onSearchChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.datatable-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;

  .datatable-actions {
    margin-bottom: 0rem;
    margin-right: 0.5rem;

    .datatable-actions-wrapper {
      margin-bottom: 0.5rem;
    }

    button {
      background-color: transparent !important;
      margin-bottom: 0;
      &:hover {
        color: $primary;
      }
    }
  }

  .datatable-nav-left,
  .datatable-nav-right {
    display: flex;
    align-items: flex-start;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .datatable-nav-left {
    justify-content: flex-start;
    > div:not(:first-child) {
      margin-left: 0.75rem;
    }
  }

  .datatable-nav-right {
    justify-content: flex-end;

    > div:not(:last-child) {
      margin-right: 0.75rem;
    }
  }

  @media only screen and (max-width: 992px) {
    flex-direction: column;
  }

  .datatable-search .search-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
