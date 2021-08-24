<template>
  <div v-if="currentTask && tasksLoaded" class="task-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentTask.taskPaid,
            draft: currentTask.taskDraft,
            pending: currentTask.taskPending,
          }"
        >
          <span v-if="currentTask.taskPaid">Paid</span>
          <span v-if="currentTask.taskDraft">Draft</span>
          <span v-if="currentTask.taskPending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditTask()" class="dark-purple">
          Edit
        </button>
        <button @click="deleteTask(currentTask.docID)" class="red">
          Delete
        </button>
        <button
          v-if="currentTask.taskPending"
          @click="updateToPaid(currentTask.docID)"
          class="green"
        >
          Mark as Paid
        </button>
        <button
          v-if="currentTask.taskPaid || currentTask.taskDraft"
          @click="updateToPending(currentTask.docID)"
          class="orange"
        >
          Mark as Pending
        </button>
      </div>
    </div>

    <div class="task-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p>{{ currentTask.taskName }}</p>
          <p>{{ currentTask.taskDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p><span>#</span>{{ currentTask.taskID }}</p>
          <p>Created By:</p>
          <p>{{ currentTask.createdBy }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="flex flex-column">
          <h4>Date Created</h4>
          <p>{{ currentTask.taskDate }}</p>
        </div>
        <div class="flex flex-column">
          <h4>Complete By</h4>
          <p>{{ currentTask.taskDueDate }}</p>
        </div>
        <div class="flex assigned flex-column">
          <h4>Assigned To</h4>
          <p>{{ currentTask.assignedTo }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div
            v-for="(item, index) in currentTask.taskItemList"
            :key="index"
            class="item flex"
          >
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ currentTask.taskTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "taskView",
  data() {
    return {
      currentTask: null,
    };
  },
  created() {
    this.getCurrentTask();
  },
  methods: {
    ...mapMutations(["SET_CURRENT_TASK", "TOGGLE_EDIT_TASK", "TOGGLE_TASK"]),
    ...mapActions([
      "DELETE_TASK",
      "UPDATE_STATUS_TO_PENDING",
      "UPDATE_STATUS_TO_PAID",
      "GET_TASKS",
    ]),

    async getCurrentTask() {
      if (!this.currentTaskArray) {
        await this.GET_TASKS();
      }

      this.SET_CURRENT_TASK(this.$route.params.taskID);

      this.currentTask = this.currentTaskArray[0];
    },
    toggleEditTask() {
      this.TOGGLE_EDIT_TASK();
      this.TOGGLE_TASK();
    },
    async deleteTask(docID) {
      await this.DELETE_TASK(docID);
      this.$router.push({ name: "Home" });
    },
    updateToPaid(docID) {
      this.UPDATE_STATUS_TO_PAID(docID);
    },
    updateToPending(docID) {
      this.UPDATE_STATUS_TO_PENDING(docID);
    },
  },
  computed: {
    ...mapState(["currentTaskArray", "editTask", "tasksLoaded"]),
  },
  watch: {
    editTask() {
      if (!this.editTask) {
        this.currentTask = this.currentTaskArray[0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.task-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: white;
    font-size: 12px;

    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .task-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: white;
      }
    }
  }

  .task-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        flex: 2;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: white;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
        flex: 1;

        p:first-child {
          text-transform: uppercase;
        }
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 32px;
      flex: 1;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
        font-weight: 600;
      }

      .assigned {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: white;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: white;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 24px;
          text-align: right;
        }
      }
    }
  }
}
</style>
