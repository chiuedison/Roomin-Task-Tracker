import { createStore } from "vuex";
import { db, auth } from "../firebase/firebaseInit";
import firebase from "firebase/app";
import { uid } from "uid";
//import router from "@/router";

export default createStore({
  state: {
    userProfile: null,
    userLoaded: null,
    loggedIn: null,

    groupJoined: null,
    groupLoaded: null,

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
        return task.taskID === payload;
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
          task.taskPaid = true;
          task.taskPending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.taskData.forEach((task) => {
        if (task.docID === payload) {
          task.taskPaid = false;
          task.taskPending = true;
          task.taskDraft = false;
        }
      });
    },

    //************************************************************/
    //*********************** USER MUTATIONS *********************/
    //************************************************************/

    USER_LOADED(state) {
      state.userLoaded = true;
    },
    CHECK_LOGIN(state) {
      const user = auth.currentUser;
      if (user) {
        state.loggedIn = true;
      } else {
        state.loggedIn = false;
      }
    },

    //************************************************************/
    //*********************** GROUP MUTATIONS ********************/
    //************************************************************/

    ADD_GROUP(state, payload) {
      state.userProfile.groupID = payload;
      state.groupJoined = true;
    },
    JOINED_GROUP(state) {
      state.groupJoined = true;
    },
    GET_GROUP_STATUS(state) {
      if (state.userProfile.groupID) {
        state.groupJoined = true;
      } else {
        state.groupJoined = false;
      }

      state.groupLoaded = true;
    },
  },
  actions: {
    async GET_TASKS({ dispatch, commit, state }) {
      const getData = db.collection("tasks");
      const results = await getData.get();

      do {
        console.log("waiting on auth...");
      } while (!auth.currentUser);

      commit("CHECK_LOGIN");
      await dispatch("GET_USER_DATA");

      if (state.userProfile.groupID) {
        const groupDoc = await db
          .collection("groups")
          .doc(state.userProfile.groupID)
          .get();
        const taskArray = groupDoc.data().tasks;

        taskArray.forEach((groupTaskID) => {
          // loops through each doc in tasks collection
          results.forEach((doc) => {
            // searches for matching task
            if (groupTaskID == doc.id) {
              // searches for doc in taskData array, adds it into array if not found
              if (!state.taskData.some((task) => task.docID === doc.id)) {
                const data = {
                  docID: doc.id,
                  taskID: doc.data().taskID,

                  taskName: doc.data().taskName,
                  billerCity: doc.data().billerCity,
                  billerZipCode: doc.data().billerZipCode,
                  billerCountry: doc.data().billerCountry,
                  clientName: doc.data().clientName,
                  clientEmail: doc.data().clientEmail,
                  clientStreetAddress: doc.data().clientStreetAddress,
                  clientCity: doc.data().clientCity,
                  clientZipCode: doc.data().clientZipCode,
                  clientCountry: doc.data().clientCountry,
                  taskDateUnix: doc.data().taskDateUnix,
                  taskDate: doc.data().taskDate,
                  paymentTerms: doc.data().paymentTerms,
                  taskDueDateUnix: doc.data().taskDueDateUnix,
                  taskDueDateCal: doc.data().taskDueDateCal,
                  taskDueDate: doc.data().taskDueDate,
                  productDescription: doc.data().productDescription,
                  taskPending: doc.data().taskPending,
                  taskDraft: doc.data().taskDraft,
                  taskItemList: doc.data().taskItemList,
                  taskTotal: doc.data().taskTotal,
                  taskPaid: doc.data().taskPaid,
                };

                commit("SET_TASK_DATA", data);
              }
            }
          });
        });
      }

      commit("TASKS_LOADED");
    },

    async UPDATE_TASK({ commit, dispatch }, { docID, routeID }) {
      commit("DELETE_TASK", docID);
      await dispatch("GET_TASKS");
      commit("TOGGLE_TASK");
      commit("TOGGLE_EDIT_TASK");

      commit("SET_CURRENT_TASK", routeID);
    },

    async DELETE_TASK({ commit, state }, docID) {
      // back-end
      const getTask = db.collection("tasks").doc(docID);
      await getTask.delete();

      const groupDoc = db.collection("groups").doc(state.userProfile.groupID);
      groupDoc.update({
        tasks: firebase.firestore.FieldValue.arrayRemove(docID),
      });

      // front-end
      commit("DELETE_TASK", docID);
    },

    async UPDATE_STATUS_TO_PAID({ commit }, docID) {
      // back-end updates
      const getTask = db.collection("tasks").doc(docID);
      await getTask.update({
        taskPaid: true,
        taskPending: false,
      });

      // front-end updates
      commit("UPDATE_STATUS_TO_PAID", docID);
    },

    async UPDATE_STATUS_TO_PENDING({ commit }, docID) {
      // back-end updates
      const getTask = db.collection("tasks").doc(docID);
      await getTask.update({
        taskPaid: false,
        taskPending: true,
        taskDraft: false,
      });

      // front-end updates
      commit("UPDATE_STATUS_TO_PENDING", docID);
    },

    //************************************************************/
    //*********************** USER ACTIONS ***********************/
    //************************************************************/

    async GET_USER_DATA({ commit, state }) {
      //state.groupJoined = false;

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
        commit("GET_GROUP_STATUS");
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

    async GET_CODE({ state }) {
      const id = state.userProfile.groupID;
      let groupDoc = db.collection("groups").doc(id);

      return groupDoc.get().then((doc) => doc.data().access_code);
    },
  },
  modules: {},
});
