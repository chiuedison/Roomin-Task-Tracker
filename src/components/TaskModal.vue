<template>
  <div @click="checkClick" ref="taskWrap" class="task-wrap flex flex-column">
    <form @submit.prevent="submitForm" class="task-content">
      <Loading v-show="loading" />
      <h1 v-if="!editTask">New Task</h1>
      <h1 v-else>Edit Task</h1>

      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="biller-street-address">Street Address</label>
          <input
            required
            type="text"
            id="biller-street-address"
            v-model="billerStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="biller-city">City</label>
            <input required type="text" id="biller-city" v-model="billerCity" />
          </div>
          <div class="input flex flex-column">
            <label for="biller-zipcode">Zip Code</label>
            <input
              required
              type="text"
              id="biller-zipcode"
              v-model="billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="biller-country">Country</label>
            <input
              required
              type="text"
              id="biller-country"
              v-model="billerCountry"
            />
          </div>
        </div>
      </div>

      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="client-name">Client Name</label>
          <input required type="text" id="client-name" v-model="clientName" />
        </div>
        <div class="input flex flex-column">
          <label for="client-email">Client Email</label>
          <input required type="text" id="client-email" v-model="clientEmail" />
        </div>
        <div class="input flex flex-column">
          <label for="client-street-address">Street Address</label>
          <input
            required
            type="text"
            id="client-street-address"
            v-model="clientStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="client-city">City</label>
            <input required type="text" id="client-city" v-model="clientCity" />
          </div>
          <div class="input flex flex-column">
            <label for="client-zipcode">Zip Code</label>
            <input
              required
              type="text"
              id="client-zipcode"
              v-model="clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="client-country">Country</label>
            <input
              required
              type="text"
              id="client-country"
              v-model="clientCountry"
            />
          </div>
        </div>
      </div>

      <div class="task-work flex flex-column">
        <div class="dates flex">
          <div class="input flex flex-column">
            <label for="task-date">Date Created</label>
            <input disabled type="text" id="task-date" v-model="taskDate" />
          </div>
          <div class="input flex flex-column">
            <label for="task-due-date">Due Date</label>
            <div class="calendar" id="task-due-date">
              <Calendar v-model="taskDueDateCal" dateFormat="M dd, yy" :minDate="minDate" :manualInput="false" />
            </div>
          </div>
        </div>
        <!-- <div class="input flex flex-column">
          <label for="payment-terms">Payment Terms</label>
          <select
            required
            type="text"
            id="payment-terms"
            v-model="paymentTerms"
          >
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div> -->
        <div class="input flex flex-column">
          <label for="product-description">Product Description</label>
          <input
            required
            type="text"
            id="product-description"
            v-model="productDescription"
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in taskItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" id="" v-model="item.itemName" />
              </td>
              <td class="qty">
                <input type="text" id="" v-model="item.qty" />
              </td>
              <td class="price">
                <input type="text" id="" v-model="item.price" />
              </td>
              <td class="total flex">
                ${{ (item.total = item.qty * item.price) }}
              </td>
              <img
                @click="deleteTaskItem(item.id)"
                src="@/assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>

          <div @click="addNewTaskItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>

      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeTask" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editTask"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
          >
            Save Draft
          </button>
          <button
            v-if="!editTask"
            type="submit"
            @click="publishTask"
            class="purple"
          >
            Create Task
          </button>
          <button v-if="editTask" type="submit" class="purple">
            Update Task
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../firebase/firebaseInit";
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";

import Loading from "../components/Loading.vue";
import Calendar from "primevue/calendar";

export default {
  name: "taskModal",
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      loading: null,
      docID: null,

      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      taskDateUnix: null,
      taskDate: null,
      //paymentTerms: null,
      productDescription: null,
      taskPending: null,
      taskDraft: null,
      taskItemList: [],
      taskTotal: 0,

      taskDueDateUnix: null,
      taskDueDateCal: null,
      taskDueDate: null,
      minDate: null,
    };
  },
  components: {
    Loading,
    Calendar,
  },
  created() {
    if (!this.editTask) {
      // get current date
      this.taskDateUnix = Date.now();
      this.taskDate = new Date(this.taskDateUnix).toLocaleString(
        "en-us",
        this.dateOptions
      );
    }

    if (this.editTask) {
      const currentTask = this.currentTaskArray[0];
      this.docID = currentTask.docID;
      this.billerStreetAddress = currentTask.billerStreetAddress;
      this.billerCity = currentTask.billerCity;
      this.billerZipCode = currentTask.billerZipCode;
      this.billerCountry = currentTask.billerCountry;
      this.clientName = currentTask.clientName;
      this.clientEmail = currentTask.clientEmail;
      this.clientStreetAddress = currentTask.clientStreetAddress;
      this.clientCity = currentTask.clientCity;
      this.clientZipCode = currentTask.clientZipCode;
      this.clientCountry = currentTask.clientCountry;
      this.taskDateCal = currentTask.taskDateCal;
      this.taskDateUnix = currentTask.taskDateUnix;
      this.taskDate = currentTask.taskDate;
      //this.paymentTerms = currentTask.paymentTerms;
      this.taskDueDateUnix = currentTask.taskDueDateUnix;
      this.taskDueDateCal = currentTask.taskDueDate;
      this.taskDueDate = currentTask.taskDueDate;
      this.productDescription = currentTask.productDescription;
      this.taskPending = currentTask.taskPending;
      this.taskDraft = currentTask.taskDraft;
      this.taskItemList = currentTask.taskItemList;
      this.taskTotal = currentTask.taskTotal;
    }

    this.minDate = new Date();
  },
  methods: {
    ...mapMutations(["TOGGLE_TASK", "TOGGLE_EXIT", "TOGGLE_EDIT_TASK"]),
    ...mapActions(["UPDATE_TASK", "GET_TASKS"]),

    checkClick(e) {
      if (e.target === this.$refs.taskWrap) {
        this.TOGGLE_EXIT();
      }
    },

    closeTask() {
      this.TOGGLE_TASK();

      if (this.editTask) {
        this.TOGGLE_EDIT_TASK();
      }
    },
    addNewTaskItem() {
      this.taskItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteTaskItem(id) {
      this.taskItemList = this.taskItemList.filter((item) => item.id !== id);
    },
    calculateTotal() {
      this.taskTotal = 0;
      this.taskItemList.forEach((item) => {
        this.taskTotal += item.total;
      });
    },

    publishTask() {
      this.taskPending = true;
    },
    saveDraft() {
      this.taskDraft = true;
    },

    async uploadTask() {
      if (this.taskItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.calculateTotal();

      const dataBase = db.collection("tasks").doc();

      await dataBase.set({
        taskID: uid(6),

        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        taskDateUnix: this.taskDateUnix,
        taskDate: this.taskDate,
        //paymentTerms: this.paymentTerms,
        taskDueDateUnix: this.taskDueDateUnix,
        taskDueDateCal: this.taskDueDateCal,
        taskDueDate: this.taskDueDate,
        productDescription: this.productDescription,
        taskPending: this.taskPending,
        taskDraft: this.taskDraft,
        taskItemList: this.taskItemList,
        taskTotal: this.taskTotal,

        taskPaid: null,
      });

      console.log(this.userProfile.groupID);
      const groupDoc = db.collection("groups").doc(this.userProfile.groupID);
      groupDoc.update({
        tasks: firebase.firestore.FieldValue.arrayUnion(dataBase.id),
      });

      this.loading = false;
      this.TOGGLE_TASK();
      this.GET_TASKS();
    },
    async updateTask() {
      if (this.taskItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.calculateTotal();

      const dataBase = db.collection("tasks").doc(this.docID);

      await dataBase.update({
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        //paymentTerms: this.paymentTerms,
        taskDueDateUnix: this.taskDueDateUnix,
        taskDueDateCal: this.taskDueDateCal,
        taskDueDate: this.taskDueDate,
        productDescription: this.productDescription,
        taskItemList: this.taskItemList,
        taskTotal: this.taskTotal,
      });

      this.loading = false;

      const data = { docID: this.docID, routeID: this.$route.params.taskID };
      this.UPDATE_TASK(data);
    },
    submitForm() {
      if (this.editTask) {
        this.updateTask();
        return;
      }
      this.uploadTask();
    },
  },
  computed: {
    ...mapState(["editTask", "currentTaskArray", "userProfile"]),
  },
  watch: {
    //? REFER TO THIS METHOD FOR RECURRING DUE DATES
    /*paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleString(
        "en-us",
        this.dateOptions
      );
    },*/

    taskDueDateCal() {
      this.taskDueDate = new Date(this.taskDueDateCal).toLocaleString(
        "en-us",
        this.dateOptions
      );
      this.taskDueDateUnix = parseInt((new Date(this.taskDueDate).getTime()).toFixed(0)); 
    },
  },
};
</script>

<style lang="scss" scoped>
.task-wrap {
  position: fixed;
  top: 78px;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: calc(100vh - 78px);
  z-index: 100;

  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  .task-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: white;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: white;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      margin-bottom: 24px;
      color: #7c5dfa;
      font-size: 12px;
    }

    // Bill to / Bill from
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // task work
    .task-work {
      .dates {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 20px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
              cursor: pointer;
            }
          }
        }

        .button {
          color: white;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: white;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
