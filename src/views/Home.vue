<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-lg">
      <h1 class="text-3xl text-sky-400 font-bold">VirtualConnect</h1>
      <div class="flex items-center space-x-4">
        <!-- Profile Icon -->
        <div class="relative">
          <button
            @click="toggleProfile"
            class="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center font-bold text-lg"
          >
            {{ username ? username.charAt(0).toUpperCase() : "?" }}
          </button>

          <!-- Profile Dropdown -->
          <div
            v-if="showProfile"
            class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-xl shadow-lg p-4 text-left z-50"
          >
            <p class="font-semibold text-sm"><strong>Username: </strong>{{ username }}</p>
            <p class="text-gray-300 text-sm"><strong>Email: </strong>{{ email }}</p>
          </div>
        </div>

        <button @click="logout" class="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg">
          Logout
        </button>
      </div>
    </nav>

    <!-- Search Bar -->
    <div class="p-6 max-w-lg mx-auto">
      <input
        v-model="searchQuery"
        @input="searchUsers"
        type="text"
        placeholder="Search username..."
        class="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Search Results -->
      <div v-if="searchResults.length" class="mt-4 bg-gray-800 rounded-lg p-4">
        <h3 class="font-semibold mb-2">Search Results</h3>
        <ul class="space-y-2">
          <li v-for="user in searchResults" :key="user.id" class="flex justify-between items-center">
            <span>{{ user.username }}</span>
            <span v-if="isFriend(user.id)" class="text-green-400 font-semibold">Friend</span>
            <button
              v-else
              @click="addFriend(user.id)"
              class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              + Add Friend
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Friends List -->
    <div class="p-6 max-w-lg mx-auto">
      <h3 class="font-semibold text-lg mb-3">Your Friends 👥</h3>
      <div v-if="friends.length" class="bg-gray-800 p-4 rounded-lg">
        <ul class="space-y-2">
          <li v-for="friend in friends" :key="friend.id" class="flex justify-between items-center">
            <div>
              <span>{{ friend.username }}</span>
              <span v-if="friend.is_online" class="ml-2 text-green-400 text-sm">● Online</span>
              <span v-else class="ml-2 text-gray-400 text-sm">
                Last seen: {{ friend.last_seen ? new Date(friend.last_seen).toLocaleTimeString() : "N/A" }}
              </span>
            </div>
            <!-- <button class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">📞 Call</button> -->
             <button @click="startCall(friend.id)" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">📞 Call</button>


          </li>
        </ul>
      </div>
      <p v-else class="text-gray-400">No friends yet. Search and add some!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

const router = useRouter();
const username = ref("");
const email = ref("");
const showProfile = ref(false);

const searchQuery = ref("");
const searchResults = ref([]);
const friends = ref([]);
const currentUserId = ref("");

// toggle dropdown
const toggleProfile = () => {
  showProfile.value = !showProfile.value;
};

// Start Call
const startCall = (friendId) => {
  router.push(`/call/${friendId}`);
};


// logout
const logout = async () => {
  await supabase
    .from("profiles")
    .update({ is_online: false, last_seen: new Date().toISOString() })
    .eq("id", currentUserId.value);

  await supabase.auth.signOut();
  localStorage.removeItem("jwt");
  router.push("/");
};

// search users
const searchUsers = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .ilike("username", `%${searchQuery.value}%`)
    .neq("id", currentUserId.value);

  if (error) {
    console.error("Search error:", error.message);
    return;
  }

  searchResults.value = data || [];
};

// check if already friend
const isFriend = (userId) => {
  return friends.value.some((f) => f.id === userId);
};

// add friend
const addFriend = async (friendId) => {
  const { error } = await supabase.from("friends").insert([
    { user_id: currentUserId.value, friend_id: friendId },
    { user_id: friendId, friend_id: currentUserId.value }, // mutual
  ]);

  if (error) {
    console.error("Add friend error:", error.message);
    return;
  }

  await fetchFriends();
  searchResults.value = [];
  searchQuery.value = "";
};

// fetch friends
const fetchFriends = async () => {
  const { data, error } = await supabase
    .from("friends")
    .select(`
      friend_id,
      profiles:friend_id ( username, is_online, last_seen )
    `)
    .eq("user_id", currentUserId.value);

  if (error) {
    console.error("Fetch friends error:", error.message);
    friends.value = [];
    return;
  }

  friends.value =
    data?.map((f) => ({
      id: f.friend_id,
      username: f.profiles?.username || "Unknown",
      is_online: f.profiles?.is_online || false,
      last_seen: f.profiles?.last_seen || null,
    })) || [];
};

// load user profile
onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    router.push("/login");
    return;
  }

  currentUserId.value = user.id;
  email.value = user.email;

  // fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile) {
    username.value = profile.username;
  }

  await supabase.from("profiles").update({ is_online: true }).eq("id", user.id);

  
  window.addEventListener("beforeunload", async () => {
    await supabase
      .from("profiles")
      .update({ is_online: false, last_seen: new Date().toISOString() })
      .eq("id", user.id);
  });

  await fetchFriends();


  supabase
    .channel("online-status")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "profiles" },
      (payload) => {
        const updated = payload.new;
        const friendIndex = friends.value.findIndex((f) => f.id === updated.id);
        if (friendIndex !== -1) {
          friends.value[friendIndex].is_online = updated.is_online;
          friends.value[friendIndex].last_seen = updated.last_seen;
        }
      }
    )
    .subscribe();
});
</script>
