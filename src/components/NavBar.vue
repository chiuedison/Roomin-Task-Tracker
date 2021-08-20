<template>
  <header class="flex">
    <div class="branding flex">
      <img src="@/assets/Roomin-Logo-White.png" alt="" />
    </div>
    <div class="links flex">
      <router-link to="/profile" class="profile">
        <h4>Profile</h4>
      </router-link>
      <div @click="Logout" class="logout">
        <h4>Logout {{ name }}</h4>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { auth } from "../firebase/firebaseInit.js";

export default {
  name: "Navbar",

  //! move to state index.js and put into state variable to use on home view
  setup() {
    const name = ref("");

    onBeforeMount(() => {
      const user = auth.currentUser;
      if (user) {
        name.value = user.email.split("@")[0];
      }
    });

    const Logout = () => {
      auth
        .signOut()
        .then(() => console.log("Signed Out"))
        .catch((err) => alert(err.message));
    };

    return {
      name,
      Logout,
    };
  },
  methods: {
    Profile() {},
  },
};
</script>

<style lang="scss" scoped>
header {
  z-index: 99;
  flex-direction: row;
  background-color: #1e2139;
  align-items: center;

  .branding {
    border-radius: 0 20px 20px 0;
    background-color: #7c5dfa;
    justify-content: center;
    padding: 24px;

    img {
      width: auto;
      height: 30px;
      background-color: transparent;
    }
  }

  .links {
    margin-left: auto;
    margin-right: 16px;

    .logout,
    .profile {
      margin-right: 32px;
      h4 {
        cursor: pointer;
      }
    }

    .profile {
      text-decoration: none;
    }
  }
}
</style>
