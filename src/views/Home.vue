<template>
  <div v-if="userLoaded && userProfile.groupID" class="home container">
    <h1 class="hello">Hello, {{ userProfile.firstName }}</h1>
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Tasks</h1>
        <span>There are {{ taskData.length }} total tasks</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span
            >Filter by status<span v-if="filteredTask"
              >: {{ filteredTask }}</span
            ></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredTasks">Draft</li>
            <li @click="filteredTasks">Pending</li>
            <li @click="filteredTasks">Paid</li>
            <li @click="filteredTasks">Clear Filter</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Task</span>
        </div>
      </div>
    </div>

    <div v-if="taskData.length > 0">
      <Task v-for="(task, index) in filteredData" :key="index" :task="task" />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>Create a new task by clicking the New Task button and get started</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import Task from "../components/Task.vue";

export default {
  name: "Home",
  data() {
    return {
      filterMenu: null,
      filteredTask: null,
      username: null,
    };
  },
  components: {
    Task,
  },
  methods: {
    ...mapMutations(["TOGGLE_TASK"]),
    ...mapActions(["GET_USER_DATA"]),

    newInvoice() {
      this.TOGGLE_TASK();
    },
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },
    filteredTasks(e) {
      if (e.target.innerText === "Clear Filter") {
        this.filteredTask = null;
        return;
      }
      this.filteredTask = e.target.innerText;
    },

    async checkGroups() {
      await this.GET_USER_DATA();

      console.log(this.userProfile.groupID);
      if (!this.userProfile.groupID) {
        this.$router.push("Groups");
      }
    },
  },
  computed: {
    ...mapState(["taskData", "userProfile", "userLoaded", "groupJoined"]),

    filteredData() {
      return this.taskData.filter((task) => {
        if (this.filteredTask === "Draft") {
          return task.invoiceDraft === true;
        }
        if (this.filteredTask === "Pending") {
          return task.invoicePending === true;
        }
        if (this.filteredTask === "Paid") {
          return task.invoicePaid === true;
        }
        return task;
      });
    },
  },
  created() {
    this.checkGroups();
  },
};
</script>

<style lang="scss" scoped>
.home {
  color: white;

  .hello {
    width: 100vw;
    margin-bottom: 16px;
  }

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: white;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: white;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 240px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
