<template>
  <div class="search-container">
    <input
      type="text"
      placeholder="Search.."
      name="search"
      @input="emitChange($event.target.value)"
    />
    <button type="submit" @click="emitClick()">
      <i class="fa fa-search"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(props, context) {
    const value = ref("");

    const emitChange = (input: string) => {
      value.value = input;
      context.emit("change", value.value);
    };

    const emitClick = () => {
      context.emit("search", value.value);
    };
    return { emitChange, emitClick };
  },
});
</script>

<style scoped lang="scss">
.search-container {
  float: right;
}

input[type="text"] {
  padding: 6px;
  font-size: 17px;
  border-radius: 3px;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
}

.search-container button {
  float: right;
  padding: 6px 10px;
  background: #ddd;
  margin: 0 !important;
  font-size: 17px;
  height: 29px !important;
  cursor: pointer;
}

.search-container button:hover {
  background: #ccc;
}

@media screen and (max-width: 600px) {
  .search-container {
    float: none;
  }

  input,
  .search-container button {
    float: none;
    display: block;
    text-align: left;
    width: 100%;
    margin: 0;
    padding: 14px;
  }
  input {
    border: 1px solid #ccc;
  }
}
</style>
