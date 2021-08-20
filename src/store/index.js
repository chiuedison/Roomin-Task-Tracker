import { createStore } from "vuex";
import { db, auth } from "../firebase/firebaseInit";
import firebase from "firebase/app";
import { uid } from "uid";

export default createStore({
  state: {
    userProfile: null,
    userLoaded: null,

    groupJoined: null,

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

    //************************************************************/
    //*********************** GROUP MUTATIONS ********************/
    //************************************************************/

    ADD_GROUP(state, payload) {
      state.userProfile.groupID = payload;
    },

    JOINED_GROUP(state) {
      state.groupJoined = true;
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
              groupID: doc.data().groupID,
            };
          }
        });
      }

      commit("USER_LOADED");
      if (state.userProfile.groupID) {
        commit("JOINED_GROUP");
      }
    },
    async UPDATE_USER_DATA({ state }, payload) {
      state.userProfile.firstName = payload.firstName;
      state.userProfile.lastName = payload.lastName;

      const userDoc = db.collection("users").doc(state.userProfile.docID);

      await userDoc.update({
        firstName: payload.firstName,
        lastName: payload.lastName,
      });
    },

    //************************************************************/
    //*********************** GROUP ACTIONS **********************/
    //************************************************************/

    async CREATE_GROUP({ commit, state }, payload) {
      // creating new group doc
      const groupDoc = db.collection("groups").doc();
      await groupDoc.set({
        tasks: [],
        users: [state.userProfile.userID],
        name: payload,
        access_code: uid(4),
      });

      // back-end updating user's group id
      const userDoc = db.collection("users").doc(state.userProfile.docID);
      await userDoc.update({
        groupID: groupDoc.id,
      });

      // front-end updates
      commit("ADD_GROUP", groupDoc.id);
    },

    async JOIN_GROUP({ commit, state }, payload) {
      state.groupJoined = false;

      const groupDB = db.collection("groups");
      const results = await groupDB.get();

      results.forEach((doc) => {
        if (doc.data().access_code == payload) {
          // back-end updating user's group id
          const userDoc = db.collection("users").doc(state.userProfile.docID);
          userDoc.update({
            groupID: doc.id,
          });
          
          // front-end updates
          commit("ADD_GROUP", doc.id);

          // updating group doc with new user
          const groupDoc = db.collection("groups").doc(doc.id);
          groupDoc.update({
            users: firebase.firestore.FieldValue.arrayUnion(
              state.userProfile.userID
            ),
          });

          state.groupJoined = true;
        }
      });
    },
  },
  modules: {},
});
