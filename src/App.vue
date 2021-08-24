<template>
  <div v-if="true">
    <div v-if="!mobile" class="app flex flex-column">
      <NavBar />
      <div class="app-content flex flex-column">
        <ExitModal v-if="exitModal" />
        <transition name="task">
          <TaskModal v-if="taskModal" />
        </transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-screen flex flex-column">
      <h2>Sorry, Roomin' is not currently supported on Mobile Devices.</h2>
      <p>
        Please use a computer or tablet, and stay tuned for the future release
        of the Roomin' mobile app!
      </p>
    </div>
  </div>
  <div v-else>
    <Loading />
  </div>
</template>

<script>
import { onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";

import { auth } from "./firebase/firebaseInit.js";
import { mapState, mapActions, mapMutations } from "vuex";

import NavBar from "./components/NavBar.vue";
import TaskModal from "./components/TaskModal.vue";
import ExitModal from "./components/ExitModal.vue";
import Loading from "./components/Loading.vue";

export default {
  data() {
    return {
      mobile: null,
    };
  },
  components: {
    NavBar,
    TaskModal,
    ExitModal,
    Loading,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          router.replace("/login");
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace("/");
        }
      });
    });
  },
  created() {
    //this.GET_TASKS();
    //this.CHECK_LOGIN();

    this.checkDevice();
    window.addEventListener("resize", this.checkDevice);
  },
  methods: {
    ...mapActions(["GET_TASKS", "GET_USER_DATA"]),
    ...mapMutations(["CHECK_LOGIN"]),

    checkDevice() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 750) {
        this.mobile = true;
        return;
      }

      this.mobile = false;
    },
  },
  computed: {
    ...mapState(["taskModal", "exitModal", "tasksLoaded", "userProfile"]),
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  background-color: #141625;
  min-height: 100vh;

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-screen {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: white;

  h2 {
    margin: 0 50px;
  }

  p {
    margin: 16px 50px 0 50px;
  }
}

// animated task
.task-enter-active,
.task-leave-active {
  transition: 0.8s ease all;
}

.task-enter-from,
.task-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}

.p-datepicker-group-container {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
}

.p-datepicker {
  width: 280px;
}

.p-inputtext {
  background-color: #1e2139;
  color: white;
  padding: 12px 4px;
  border: none;
  border-radius: 4px;
  min-width: 280px;
}

.p-disabled {
  color: darkgray;
}

.p-highlight {
  background-color: #7c5dfa;
  color: white;
  border-radius: 10px;
}

.p-datepicker-next {
  background-color: white;
  border-radius: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 16px solid #7c5dfa;
  border-bottom: 5px solid transparent;
  margin-right: 12px;
}

.p-datepicker-prev {
  background-color: white;
  border-radius: 0;
  padding: 0;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 16px solid #7c5dfa;
  border-bottom: 5px solid transparent;
  margin-left: 12px;
}

.p-datepicker-month {
  padding-right: 4px;
}
</style>
