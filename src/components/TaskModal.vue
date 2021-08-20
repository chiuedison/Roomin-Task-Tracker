<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
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

      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoice-date">Invoice Date</label>
            <input
              disabled
              type="text"
              id="invoice-date"
              v-model="invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <label for="payment-due-date">Payment Due Date</label>
            <input
              disabled
              type="text"
              id="payment-due-date"
              v-model="paymentDueDate"
            />
          </div>
        </div>
        <div class="input flex flex-column">
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
        </div>
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
              v-for="(item, index) in invoiceItemList"
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
                @click="deleteInvoiceItem(item.id)"
                src="@/assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>

      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
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
            @click="publishInvoice"
            class="purple"
          >
            Create Invoice
          </button>
          <button v-if="editTask" type="submit" class="purple">
            Update Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { db } from "../firebase/firebaseInit";
import Loading from "../components/Loading.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";

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
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  components: {
    Loading,
  },
  created() {
    if (!this.editTask) {
      // get current date
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleString(
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
      this.invoiceDateUnix = currentTask.invoiceDateUnix;
      this.invoiceDate = currentTask.invoiceDate;
      this.paymentTerms = currentTask.paymentTerms;
      this.paymentDueDateUnix = currentTask.paymentDueDateUnix;
      this.paymentDueDate = currentTask.paymentDueDate;
      this.productDescription = currentTask.productDescription;
      this.invoicePending = currentTask.invoicePending;
      this.invoiceDraft = currentTask.invoiceDraft;
      this.invoiceItemList = currentTask.invoiceItemList;
      this.invoiceTotal = currentTask.invoiceTotal;
    }
  },
  methods: {
    ...mapMutations(["TOGGLE_TASK", "TOGGLE_EXIT", "TOGGLE_EDIT_TASK"]),
    ...mapActions(["UPDATE_TASK", "GET_TASKS"]),

    checkClick(e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_EXIT();
      }
    },

    closeInvoice() {
      this.TOGGLE_TASK();

      if (this.editTask) {
        this.TOGGLE_EDIT_TASK();
      }
    },
    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter(
        (item) => item.id !== id
      );
    },
    calculateTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((item) => {
        this.invoiceTotal += item.total;
      });
    },

    publishInvoice() {
      this.invoicePending = true;
    },
    saveDraft() {
      this.invoiceDraft = true;
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.calculateTotal();

      const dataBase = db.collection("tasks").doc();

      await dataBase.set({
        invoiceID: uid(6),

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
        invoiceDateUnix: this.invoiceDateUnix,
        invoiceDate: this.invoiceDate,
        paymentTerms: this.paymentTerms,
        paymentDueDateUnix: this.paymentDueDateUnix,
        paymentDueDate: this.paymentDueDate,
        productDescription: this.productDescription,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,

        invoicePaid: null,
      });

      this.loading = false;
      this.TOGGLE_TASK();
      this.GET_TASKS();
    },
    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
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
        paymentTerms: this.paymentTerms,
        paymentDueDateUnix: this.paymentDueDateUnix,
        paymentDueDate: this.paymentDueDate,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });

      this.loading = false;

      const data = {docID: this.docID, routeID: this.$route.params.invoiceID};
      this.UPDATE_TASK(data);
    },
    submitForm() {
      if (this.editTask) {
        this.updateInvoice();
        return;
      }
      this.uploadInvoice();
    },
  },
  computed: {
    ...mapState(["editTask", "currentTaskArray"]),
  },
  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleString(
        "en-us",
        this.dateOptions
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;

  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  .invoice-content {
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

    // Invoice work
    .invoice-work {
      .payment {
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
