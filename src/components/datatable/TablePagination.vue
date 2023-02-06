<template>
  <div class="datatable-pagination">
    <div class="datatable-pagination-left">
      <slot name="size">
        <o-field horizontal :label="sizesLabel" class="datatable-size">
          <o-select name="size" v-model="currentSize" :aria-label="sizesLabel">
            <option v-for="size in sizes" :key="size" :value="size">
              {{ size }}
            </option>
          </o-select>
        </o-field>
      </slot>
    </div>

    <div class="datatable-pagination-right">
      <slot name="pagination">
        <o-pagination
          v-model:current="currentPage"
          class="pagination"
          :per-page="currentSize"
          :total="total"
          :aria-next-label="config.pageNextLabel"
          :aria-previous-label="config.pagePreviousLabel"
          :aria-page-label="config.pageLabel"
          :aria-current-label="config.pageCurrentLabel"
          @change="onPageChange" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useConfig } from "./config";

const config = useConfig();

export default defineComponent({
  props: {
    page: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    sizes: {
      type: Array as () => Array<number>,
      default: () => config.sizes,
    },
    sizesLabel: {
      type: String,
      default: config.sizesLabel,
    },
  },
  emits: ["update:size", "update:page", "change"],
  setup(props, ctx) {
    const currentSize = computed({
      get() {
        return props.size;
      },
      set(value: number) {
        ctx.emit("update:size", value);
      },
    });

    const currentPage = computed({
      get() {
        return props.page + 1;
      },
      set(value: number) {
        ctx.emit("update:page", --value);
      },
    });

    /** Handle page-change event */
    const onPageChange = (pageNumber: number): void => {
      ctx.emit("change", pageNumber);
    };

    return { currentSize, currentPage, config, onPageChange };
  },
});
</script>

<style lang="scss" scoped>
.datatable-pagination {
  display: flex;
  justify-content: space-between;

  .datatable-pagination-left,
  .datatable-pagination-right {
    display: flex;
    align-items: center;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }
}

.datatable-size {
  align-items: center;
  &,
  :deep(.input-field) {
    margin-bottom: unset;
  }
  :deep(label) {
    margin-right: -5px;
    white-space: nowrap;
  }
  :deep(select) {
    width: auto;
  }
}
</style>
