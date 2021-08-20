import { createStore } from "vuex";
import { db, auth } from "../firebase/firebaseInit";

export default createStore({
  state: {
    userProfile: null,
    userLoaded: null,

    taskData: [],
    taskModal: null,
    exitModal: null,
    tasksLoaded: null,
    currentTaskArray: null,
    editTask: null,
  },
  mutations: {
    TOGGLE_TASK(state) {
      state.taskModal = !state.taskModal;
    },
    TOGGLE_EXIT(state) {
      state.exitModal = !state.exitModal;
    },
    SET_TASK_DATA(state, payload) {
      state.taskData.push(payload);
    },
    TASKS_LOADED(state) {
      state.tasksLoaded = true;
    },
    SET_CURRENT_TASK(state, payload) {
      state.currentTaskArray = state.taskData.filter((task) => {
        return task.invoiceID === payload;
      });
    },
    TOGGLE_EDIT_TASK(state) {
      state.editTask = !state.editTask;
    },
    DELETE_TASK(state, payload) {
      state.taskData = state.taskData.filter((task) => task.docID !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.taskData.forEach((task) => {
        if (task.docID === payload) {
          task.invoicePaid = true;
          task.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.taskData.forEach((task) => {
        if (task.docID === payload) {
          task.invoicePaid = false;
          task.invoicePending = true;
          task.invoiceDraft = false;
        }
      });
    },

    //************************************************************/
    //*********************** USER MUTATIONS *********************/
    //************************************************************/

    USER_LOADED(state) {
      state.userLoaded = true;
    },

    UPDATE_USER(state) {
      state.userProfile
    },
    
  },
  actions: {
    async GET_TASKS({ commit, state }) {
      const getData = db.collection("tasks");
      const results = await getData.get();

      results.forEach((doc) => {
        // loops through each doc in firebase
        if (!state.taskData.some((task) => task.docID === doc.id)) {
          // searches for doc in taskData array, adds it into array if not found
          const data = {
            docID: doc.id,
            invoiceID: doc.data().invoiceID,

            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePaid: doc.data().invoicePaid,
          };

          commit("SET_TASK_DATA", data);
        }
      });

      commit("TASKS_LOADED");
    },

    async UPDATE_TASK({ commit, dispatch }, { docID, routeID }) {
      commit("DELETE_TASK", docID);
      await dispatch("GET_TASKS");
      commit("TOGGLE_TASK");
      commit("TOGGLE_EDIT_TASK");

      commit("SET_CURRENT_TASK", routeID);
    },

    async DELETE_TASK({ commit }, docID) {
      const getTask = db.collection("tasks").doc(docID);
      await getTask.delete();
      commit("DELETE_TASK", docID);
    },

    async UPDATE_STATUS_TO_PAID({ commit }, docID) {
      // back-end updates
      const getTask = db.collection("tasks").doc(docID);
      await getTask.update({
        invoicePaid: true,
        invoicePending: false,
      });

      // front-end updates
      commit("UPDATE_STATUS_TO_PAID", docID);
    },

    async UPDATE_STATUS_TO_PENDING({ commit }, docID) {
      // back-end updates
      const getTask = db.collection("tasks").doc(docID);
      await getTask.update({
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });

      // front-end updates
      commit("UPDATE_STATUS_TO_PENDING", docID);
    },

    
    //************************************************************/
    //*********************** USER ACTIONS ***********************/
    //************************************************************/


    async GET_USER_DATA({ commit, state }) {
      const user = auth.currentUser;
      const getUsers = db.collection("users");
      const results = await getUsers.get();

      if (user) {
        results.forEach((doc) => {
          if (doc.data().userID === user.uid) {
            state.userProfile = {
              email: doc.data().email,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              userID: doc.data().userID,
              docID: doc.id,
              groupID: doc.groupID,
            };
          }
        });
      }

      commit("USER_LOADED");
    },
    async UPDATE_USER_DATA({ state }, payload) {
      state.userProfile.firstName = payload.firstName;
      state.userProfile.lastName = payload.lastName;

      const userDoc = db.collection("users").doc(state.userProfile.docID);

      await userDoc.update({
        firstName: payload.firstName,
        lastName: payload.lastName,
      });
    }
  },
  modules: {},
});
