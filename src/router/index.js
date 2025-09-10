import { createRouter, createWebHistory } from "vue-router";

import Register from "@/Authentication/Register.vue";
import Login from "@/Authentication/Login.vue";
import Home from "@/views/Home.vue";
import Landing from "@/views/Landing.vue";
import Call from "@/views/Call.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Landing", component: Landing },
    { path: "/register", name: "Register", component: Register },
    { path: "/login", name: "Login", component: Login },
    { path: "/home", name: "Home", component: Home, meta: { requiresAuth: true } },
    { path: "/call/:id", name: "Call", component: Call, meta: { requiresAuth: true } },
  ]
});

// Protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("jwt");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
