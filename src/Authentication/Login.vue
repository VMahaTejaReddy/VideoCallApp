<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-center text-white mb-6">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="text-red-500 text-sm mt-1" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="text-red-500 text-sm mt-1" v-if="errors.password">{{ errors.password }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition"
          :disabled="auth.loading"
        >
          {{ auth.loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="text-red-500 text-sm mt-2 text-center" v-if="auth.error">{{ auth.error }}</p>

      <p class="text-gray-400 text-sm mt-4 text-center">
        Don’t have an account?
        <router-link to="/register" class="text-sky-400 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; 

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const errors = ref({ email: "", password: "" });

localStorage.removeItem("jwt"); 

const handleLogin = async () => {
  errors.value = { email: "", password: "" };

  // validation
  if (!email.value) errors.value.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.value.email = "Invalid email format";
  if (!password.value) errors.value.password = "Password is required";

  if (errors.value.email || errors.value.password) return;

  // use store action
  await auth.login({ email: email.value, password: password.value });

  if (!auth.error && auth.user) {
    router.push("/home");
  }
};
</script>
