<script lang="ts">
import { defineComponent, watch, ref, unref } from "vue";
import Modal from "@/components/Modal/Modal.vue";

export default defineComponent({
  name: "Detail",
  components: { Modal },
  props: {
    title: String,
    obj: {},
    fields: Array,
  },
  setup(props, context) {
    const objCopy = Object.assign({}, props.obj as object);
    const refObj = ref(objCopy);

    watch(props, () => {
      const objCopy = Object.assign({}, props.obj as object);
      refObj.value = objCopy;
    });

    const close = () => {
      refObj.value = {};
    };
    const emitSave = () => {
      context.emit("save", unref(refObj));
    };
    const emitDelete = () => {
      context.emit("delete", refObj);
    };
    return { refObj, close, emitSave, emitDelete };
  },
});
</script>

<template>
  <modal
    :title="title"
    @close="close"
    @save="emitSave"
    @delete="emitDelete"
    v-if="refObj && Object.keys(refObj).length > 0"
    :key="refObj"
  >
    <div class="detail" v-if="fields">
      <template v-for="(field, i) in fields">
        <label :for="field.key" :key="i">
          <span class="label">{{ field.name }}:</span>
          <input
            type="text"
            :name="field.key"
            v-model="refObj[field.key]"
            :disabled="!field.editable"
          />
        </label>
      </template>
    </div>
  </modal>
</template>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  label {
    margin: 5px;

    .label {
      min-width: 150px;
      display: inline-flex;
    }
  }
}
</style>
