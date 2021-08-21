<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Are you sure you want to exit? Your changes will not be saved.</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Return</button>
        <button @click="closeTask" class="red">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "exitModal",
  methods: {
    ...mapMutations(["TOGGLE_TASK", "TOGGLE_EXIT", "TOGGLE_EDIT_TASK"]),

    closeModal() {
      this.TOGGLE_EXIT();
    },
    closeTask() {
      this.TOGGLE_TASK();
      this.TOGGLE_EXIT();

      if (this.editTask) {
        this.TOGGLE_EDIT_TASK();
      }
    },
  },
  computed: {
    ...mapState(["editTask"]),
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 100;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 78px - 78px);
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: white;

    p {
      text-align: center;
    }

    .actions {
      margin-top: 24px;

      button {
        flex: 1;
      }
    }
  }
}
</style>
