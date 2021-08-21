<template>
  <div class="login-wrapper flex flex-column">
    <h1>Login</h1>
    <form @submit.prevent="userLogin" class="login flex flex-column">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="submit" value="Login" class="button purple" />
      <p>
        Need an account? <router-link to="/register">Register Here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase/firebaseInit.js";
import { mapMutations } from "vuex";

export default {
  name: "Login",

  setup() {
    const email = ref("");
    const password = ref("");

    const userLogin = () => {
      auth
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => console.log(data))
        .catch((err) => alert(err.message));
    };

    return {
      userLogin,
      email,
      password,
    };
  },
  methods: {
    ...mapMutations(["CHECK_LOGIN"]),
  },
  created() {
    this.CHECK_LOGIN();
  },
};
</script>

<style lang="scss" scoped>
* {
  color: white;
}

.login-wrapper {
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.login {
  justify-content: center;
  align-items: center;

  input {
    margin-top: 8px;
    min-width: 300px;
    color: black;
  }

  p {
    margin-top: 16px;
  }

  .button {
    font-size: 16px;
  }
}
</style>
