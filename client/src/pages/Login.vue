<template>
  <div class="login">
    <div class="project-logo"></div>
    <div class="auth-panel">
      <section class="auth-mode-control">
        <Button class="btn-mode" @click="onAuthModeChange">{{
          modeButtonText
        }}</Button>
      </section>
      <section class="input-form">
        <Input
          placeholder="username"
          label="username"
          v-model="username"
          class="username"
        />
        <Input
          placeholder="password"
          label="password"
          v-model="password"
          class="password"
        />
        <Button class="btn-submit" @click="onSubmit">{{
          submitButtonText
        }}</Button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Button from "@/components/Button/Button.vue";
import Input from "@/components/Input/Input.vue";
import { AuthRes } from "../services/account/types";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      authMode: "login",
    };
  },
  methods: {
    onAuthModeChange() {
      this.authMode = this.authMode === "login" ? "signup" : "login";
    },
    onSubmit() {
      if (this.username.trim() === "" || this.password.trim() === "") {
        alert("please provide username/password");
        return;
      }
      const authData: AuthRes = {
        username: this.username,
        password: this.password,
      };
      if (this.authMode === "login") {
        this.login(authData);
      } else {
        this.signup(authData);
      }
    },
    ...mapActions({
      login: `account/login`,
      signup: `account/signup`,
    }),
  },
  computed: {
    modeButtonText(): string {
      return this.authMode === "login" ? "Switch to Signup" : "Switch to Login";
    },
    submitButtonText(): string {
      return this.authMode === "login" ? "Login" : "Signup";
    },
  },
  components: {
    Input,
    Button,
  },
});
</script>

<style lang="scss">
.auth-panel {
  display: flex;
  flex-direction: column;

  .auth-mode-control {
    text-align: center;
  }
}
</style>
