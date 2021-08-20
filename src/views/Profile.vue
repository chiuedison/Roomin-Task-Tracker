<template>
  <router-link class="nav-link flex" :to="{ name: 'Home' }">
    <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
  </router-link>
  <div class="profile-wrapper flex flex-column">
    <h1>My Profile</h1>
    <form
      @submit.prevent="updateProfile"
      class="update-profile flex flex-column"
    >
      <h2>Edit Profile</h2>
      <div class="name flex">
        <div class="input flex flex-column">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" />
        </div>
        <div class="input flex flex-column">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" v-model="lastName" />
        </div>
      </div>
      <div class="email">
        <div class="input flex flex-column">
          <label for="email">Email Address</label>
          <input
            :readonly="true"
            type="text"
            id="email"
            v-model="emailAddress"
          />
        </div>
      </div>

      <div class="update flex">
        <button type="submit" class="purple">Update Profile</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      firstName: null,
      lastName: null,
      emailAddress: null,
      userID: null,
    };
  },
  methods: {
    ...mapActions(["GET_USER_DATA", "UPDATE_USER_DATA"]),

    async getData() {
      await this.GET_USER_DATA();

      this.firstName = this.userProfile.firstName;
      this.lastName = this.userProfile.lastName;
      this.emailAddress = this.userProfile.email;
      this.userID = this.userProfile.userID;
    },
    updateProfile() {
      this.UPDATE_USER_DATA({
        firstName: this.firstName,
        lastName: this.lastName,
      });

      this.$router.push({ name: "Home" });
    },
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState(["userProfile"]),
  },
};
</script>

<style lang="scss" scoped>
.nav-link {
  margin-top: 32px;
  margin-left: 32px;
  align-items: center;
  color: white;
  font-size: 18px;

  img {
    margin-right: 16px;
    width: 7px;
    height: 10px;
  }
}

.profile-wrapper {
  align-items: center;

  h1 {
    margin-top: 32px;
  }
}

.update-profile {
  margin-top: 16px;
  max-width: 700px;
  gap: 16px;

  .name {
    gap: 32px;
  }

  input {
    color: black;
  }

  .update,
  button {
    margin-top: 4px;
    justify-content: center;
    font-size: 16px;
  }
}
</style>
