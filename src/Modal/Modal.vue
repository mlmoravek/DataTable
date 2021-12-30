<template>
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">
        <slot name="header">{{ title }}</slot>
      </span>
      <button type="button" class="btn-close" @click="emitClose">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <div class="modal-footer">
      <slot name="footer">
        <button type="button" class="btn-footer btn-delete" @click="emitDelete">
          Delete
        </button>
        <button type="button" class="btn-footer btn-abort" @click="emitClose">
          Abort
        </button>
        <button type="button" class="btn-footer btn-save" @click="emitSave">
          Save
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Detail",
  components: {},
  props: {
    title: String,
  },
  setup(props, context) {
    const emitClose = () => {
      context.emit("close");
    };
    const emitSave = () => {
      context.emit("save");
    };
    const emitDelete = () => {
      context.emit("delete");
    };
    return { emitClose, emitSave, emitDelete };
  },
});
</script>

<style scoped lang="scss">
.modal {
  z-index: 101;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  border: 1px solid #aaa;
  background: white;
  border-radius: 5px;
}
.modal-header {
  background: #ccc;
  padding: 0.5em 1em;
  position: relative;
  color: #222;
  font-weight: bold;
  font-size: 1.3em;
  text-align: left;
  border-bottom: 1px solid #aaa;

  .btn-close {
    position: absolute;
    right: 0.3em;
    top: 3px;
    min-width: 19px;
    border: none;
    background: none;
    color: #555;
  }
}

.modal-content {
  width: 720px;
  min-height: 50px;
  padding: 1em;
}

.modal-footer {
  background: #ccc;
  padding: 0.5em 1em;
  position: relative;
  color: #222;
  font-weight: bold;
  font-size: 1.3em;
  border-top: 1px solid #aaa;
  text-align: right;

  .btn-footer {
    float: unset;
    margin-left: 10px !important;
  }

  .btn-save {
    color: green;
  }

  .btn-abort {
    color: black;
  }

  .btn-delete {
    color: red;
    float: left;
  }
}
</style>
