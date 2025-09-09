<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-center text-white mb-6">Register</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Username -->
        <div>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="text-red-500 text-sm mt-1" v-if="errors.username">{{ errors.username }}</p>
        </div>

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
          {{ auth.loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="text-red-500 text-sm mt-2 text-center" v-if="auth.error">{{ auth.error }}</p>

      <p class="text-gray-400 text-sm mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="text-sky-400 hover:underline">Login</router-link>
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

const username = ref("");
const email = ref("");
const password = ref("");
const errors = ref({ username: "", email: "", password: "" });

const handleRegister = async () => {
  // reset errors
  errors.value = { username: "", email: "", password: "" };

  // local validation
  if (!username.value) errors.value.username = "Username is required";
  if (!email.value) errors.value.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.value.email = "Invalid email format";
  if (!password.value) errors.value.password = "Password is required";
  else if (password.value.length < 6) errors.value.password = "Password must be at least 6 characters";

  if (errors.value.username || errors.value.email || errors.value.password) return;

  await auth.register({ email: email.value, password: password.value, username: username.value });

  if (!auth.error && auth.user) {
    router.push("/home");
  }
};
</script>
