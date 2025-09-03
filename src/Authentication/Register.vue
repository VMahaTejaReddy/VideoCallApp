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
          class="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Register
        </button>
      </form>

      <p class="text-gray-400 text-sm mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="text-indigo-400 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const errors = ref({ username: "", email: "", password: "" });

const handleRegister = async () => {
  // reset errors
  errors.value = { username: "", email: "", password: "" };

  // basic validations
  if (!username.value) errors.value.username = "Username is required";
  if (!email.value) errors.value.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.value.email = "Invalid email format";
  if (!password.value) errors.value.password = "Password is required";
  else if (password.value.length < 6) errors.value.password = "Password must be at least 6 characters";

  // stop if errors exist
  if (errors.value.username || errors.value.email || errors.value.password) return;

  // register with Supabase
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errors.value.email = error.message; // show supabase error under email field
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username: username.value,
    });

    if (data.session) {
      const token = data.session.access_token;
      localStorage.setItem("jwt", token);
      router.push("/home");
    }
  }
};
</script>
