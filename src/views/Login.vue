<template>
  <div class="d-flex justify-center">
    <v-card class="my-6" width="90%" max-width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="text"
            placeholder="Email"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            placeholder="Password"
          />
          <div class="d-flex justify-end">
            <v-btn type="submit" color="success">Login</v-btn>
            <v-btn class="ml-2" @click="clearForm">Clear</v-btn>
          </div>
        </v-form>
        <div>
          <p style="font-weight: bold">Credential for demo</p>
          <p><span style="font-weight: bold">email:</span> demo@demo.com</p>
          <p><span style="font-weight: bold">password:</span> P@ssW0rd</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAppStore } from "@/store/app";

export default {
  setup(props, { root }) {
    const store = useAppStore();
    const email = ref();
    const password = ref();

    return {
      email,
      password,
      login: (e) => {
        store.login({ email: email.value, password: password.value });
        e.preventDefault();
      },
      clearForm: () => {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>

<style>
</style>