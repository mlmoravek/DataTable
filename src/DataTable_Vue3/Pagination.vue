<template>
  <div class="pagination" v-if="pages > 0">
    <button class="btn-first" :disabled="page == 0" @click="emitPage(0)">
      First
    </button>
    <!-- <button class="btn-back" :disabled="page == 0" @click="emitPrevious()">
      Previous
    </button>-->
    <button
      v-for="item in paginations"
      :key="item"
      class="btn-page"
      :class="{ 'btn-current': page == item }"
      :disabled="page == item"
      @click="emitPage(item)"
    >
      {{ item + 1 }}
    </button>

    <!--<label>Seite <input v-model="page" type="number" /> </label>

    <label for="size">
      Size
      <input v-model="size" type="number" name="size" id="size" />
    </label>

    <button class="btn-next" :disabled="page + 1 == pages" @click="emitNext()">
      Next
    </button>-->
    <button
      class="btn-last"
      :disabled="page + 1 == pages"
      @click="emitPage(pages - 1)"
    >
      Last ({{ pages }})
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  namne: "Pagination",
  props: {
    pages: Number,
    page: Number,
  },
  setup(props, context) {
    const emitPage = (page: number) => {
      context.emit("change", page);
    };

    const paginations = computed(() => {
      const arr = [];
      const l = props.page < 3 ? 3 * 2 - props.page : 3;
      for (let i = props.page - l; i <= props.page + l; i++) {
        if (i >= 0 && i < props.pages) {
          arr.push(i);
        }
      }
      return arr;
    });

    return {
      emitPage,
      paginations,
    };
  },
});
</script>

<style lang="scss">
button[disabled] {
  cursor: unset;
}
</style>
