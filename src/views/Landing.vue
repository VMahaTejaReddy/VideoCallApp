<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-10 py-6 backdrop-blur-lg bg-white/5 sticky top-0 z-50 border-b border-white/10">
      <h1 class="text-2xl font-extrabold tracking-wide text-sky-400">VideoConnect</h1>

      <router-link :to="{name:'Register'}" class="bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-xl font-semibold shadow-lg transition">
        Sign In
      </router-link>
    </nav>

    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 relative overflow-hidden">
      <!-- Glow Background -->
      <div class="absolute w-[900px] h-[900px] bg-sky-500/20 rounded-full blur-3xl top-[-250px] left-[-250px]"></div>
      <div class="absolute w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-3xl bottom-[-200px] right-[-200px]"></div>

      <!-- Heading -->
      <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-8 relative z-10 max-w-4xl">
        Redefine How You <span class="text-sky-400">Connect</span><br />
        With Anyone, Anywhere
      </h1>

      <!-- Subtext -->
      <p class="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 relative z-10">
        Step into the future of communication. Ultra-HD calls, immersive group
        chats, and collaboration tools designed to bring people closer than ever.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-6 relative z-10 mb-20">
        <router-link
          to="/register"
          class="px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105"
        >
          Get Started
        </router-link>
        <router-link
          to="/learn-more"
          class="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-bold text-lg shadow-lg transition border border-gray-700"
        >
          Learn More
        </router-link>
      </div>

      <!-- Features Section -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-12 text-gray-300 relative z-10 mb-28">
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-3">📺</span>
          <h3 class="text-lg font-semibold">HD Video Calls</h3>
          <p class="text-sm text-gray-400 mt-2 max-w-xs">
            Experience crystal-clear quality, even on low bandwidth.
          </p>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-3">💬</span>
          <h3 class="text-lg font-semibold">Instant Chat</h3>
          <p class="text-sm text-gray-400 mt-2 max-w-xs">
            Stay connected with lightning-fast real-time messaging.
          </p>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-3">👥</span>
          <h3 class="text-lg font-semibold">Group Meetings</h3>
          <p class="text-sm text-gray-400 mt-2 max-w-xs">
            Host seamless group calls with powerful collaboration tools.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black/70 border-t border-white/10 py-6 text-center text-gray-500">
      © 2025 VideoConnect. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
    const jwt = localStorage.getItem("jwt");
    localStorage.removeItem("jwt");
</script>
