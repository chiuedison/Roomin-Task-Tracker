<template>
  <div class="register-wrapper flex flex-column">
    <h1>Register</h1>
    <form @submit.prevent="userRegister" class="register flex flex-column">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="text" placeholder="First Name" v-model="firstName" />
      <input type="text" placeholder="Last Name" v-model="lastName" />
      <input type="submit" value="Register" class="button purple" />
      <p>Have an account? <router-link to="/login">Login Here</router-link></p>
    </form>
  </div>
</template>

<script>
import { db, auth } from "../firebase/firebaseInit";

export default {
  name: "Register",

  data() {
    return {
      email: null,
      password: null,
      firstName: null,
      lastName: null,
    };
  },

  methods: {
    async userRegister() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          const dataBase = db.collection("users").doc();

          dataBase.set({
            userID: user.user.uid,
            groupID: null,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
          });
        })
        .catch((err) => alert(err.message));
    },
  },
};
</script>

<style lang="scss" scoped>
.register-wrapper {
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.register {
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
