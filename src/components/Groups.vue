<template>
  <div class="groups-wrapper flex flex-column">
    <h1>Create or Join a Group to get started!</h1>
    <div class="groups flex">
      <div class="input flex flex-column">
        <label for="join-group" style="color: white">Join Group using access code</label>
        <input
          type="text"
          id="join-group"
          placeholder="Group Code"
          v-model="groupCode"
        />
        <button type="text" @click="joinGroup" class="purple">Join</button>
      </div>
      <div class="create-group flex flex-column">
        <p>Don't have a group yet? Create one here!</p>
        <form
          class="create-form flex flex-column"
          @submit.prevent="createGroup"
        >
          <input
            required
            type="text"
            id="group-name"
            placeholder="Group Name"
            v-model="groupName"
          />
          <button type="submit" class="purple">Create Group</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Groups",
  data() {
    return {
      groupName: null,
      groupCode: null,
    };
  },
  methods: {
    ...mapActions(["CREATE_GROUP", "JOIN_GROUP", "GET_USER_DATA"]),

    async createGroup() {
      await this.CREATE_GROUP(this.groupName);
      this.$router.push({ name: "Home" });
    },

    async joinGroup() {
      await this.JOIN_GROUP(this.groupCode);

      if (this.userProfile.groupID) {
        this.$router.push({ name: "Home" });
      } else {
        alert("Invalid group code!");
      }
    },
  },
  created() {
    this.GET_USER_DATA();
  },
  computed: {
    ...mapState(["groupJoined","userProfile"]),
  },
};
</script>

<style lang="scss" scoped>
* {
  /*border: 1px solid black;*/
}

.groups-wrapper {
  margin-top: 32px;
  align-items: center;
  gap: 24px;
  color: white;

  .input {
    align-items: center;
    gap: 8px;
    flex: 1;
    color: black;
  }

  .create-group {
    align-items: center;
    text-align: center;
    gap: 8px;
    flex: 1;
    width: 500px;

    .create-form {
      gap: 8px;
    }
  }
}
</style>
