<template>
  <div v-if="currentTask" class="task-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentTask.invoicePaid,
            draft: currentTask.invoiceDraft,
            pending: currentTask.invoicePending,
          }"
        >
          <span v-if="currentTask.invoicePaid">Paid</span>
          <span v-if="currentTask.invoiceDraft">Draft</span>
          <span v-if="currentTask.invoicePending">Pending</span>
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
          v-if="currentTask.invoicePending"
          @click="updateToPaid(currentTask.docID)"
          class="green"
        >
          Mark as Paid
        </button>
        <button
          v-if="currentTask.invoicePaid || currentTask.invoiceDraft"
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
          <p><span>#</span>{{ currentTask.invoiceID }}</p>
          <p>{{ currentTask.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ currentTask.billerStreetAddress }}</p>
          <p>{{ currentTask.billerCity }}</p>
          <p>{{ currentTask.billerZipCode }}</p>
          <p>{{ currentTask.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>{{ currentTask.invoiceDate }}</p>
          <h4>Payment Date</h4>
          <p>{{ currentTask.paymentDueDate }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ currentTask.clientName }}</p>
          <p>{{ currentTask.clientStreetAddress }}</p>
          <p>{{ currentTask.clientCity }}</p>
          <p>{{ currentTask.clientZipCode }}</p>
          <p>{{ currentTask.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Send To</h4>
          <p>{{ currentTask.clientEmail }}</p>
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
            v-for="(item, index) in currentTask.invoiceItemList"
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
          <p>{{ currentTask.invoiceTotal }}</p>
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
    ...mapActions(["DELETE_TASK", "UPDATE_STATUS_TO_PENDING", "UPDATE_STATUS_TO_PAID"]),

    getCurrentTask() {
      this.SET_CURRENT_TASK(this.$route.params.invoiceID);

      this.currentTask = this.currentTaskArray[0];
    },
    toggleEditTask() {
      this.TOGGLE_EDIT_TASK();
      this.TOGGLE_TASK();
    },
    async deleteTask(docID) {
      await this.DELETE_TASK(docID);
      this.$router.push({name: "Home"});
    },
    updateToPaid(docID) {
      this.UPDATE_STATUS_TO_PAID(docID);
    },
    updateToPending(docID) {
      this.UPDATE_STATUS_TO_PENDING(docID);
    },
  },
  computed: {
    ...mapState(["currentTaskArray", "editTask"]),
  },
  watch: {
    editTask() {
      if(!this.editTask) {
        this.currentTask = this.currentTaskArray[0];
      }
    }
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
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
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
