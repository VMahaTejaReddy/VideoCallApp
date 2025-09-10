<template>

<div class="h-screen bg-gray-900 text-white flex flex-col">

<div class="flex justify-between items-center p-4 bg-gray-800">

<h2 class="text-xl font-bold">Video Call</h2>

<button @click="leaveCall" class="px-4 py-2 bg-red-600 rounded-lg">Leave</button>

</div>



<div class="flex-1 grid grid-cols-2 gap-2 p-4">

  <!-- Local Video -->

  <div id="local-player" class="bg-black rounded-lg"></div>



  <!-- Remote Videos -->

  <div id="remote-playerlist" class="grid grid-cols-2 gap-2">

    <div v-for="id in remoteUsers" :key="id" :id="'player-'+id" class="bg-black rounded-lg"></div>

  </div>

</div>



<div class="p-4 flex justify-center space-x-4">

  <button @click="toggleMic" class="px-4 py-2 bg-blue-600 rounded-lg">

    {{ micOn ? 'Mute Mic' : 'Unmute Mic' }}

  </button>

  <button @click="toggleCam" class="px-4 py-2 bg-green-600 rounded-lg">

    {{ camOn ? 'Turn Off Cam' : 'Turn On Cam' }}

  </button>

</div>



</div>

</template>



<script setup>

import { ref, onMounted, onUnmounted, nextTick } from "vue";

import { useRouter } from "vue-router"; // <-- New import

import AgoraRTC from "agora-rtc-sdk-ng";



const appId = "77698182beba4a72acabfb32e7538619"; // Replace with your Agora App ID

const channel = "test"; // you can use a dynamic one



// Replace this token with a valid, non-expired token from the Agora Console.

// The expired token is the most likely cause of the black screen.

const token = "007eJxTYLj+JjMt0WvnvKk35Kf5P2u5f5bh9el7D47Vnz6y7uoJs1u6Cgzm5maWFoYWRkmpSYkmieZGicmJSWlJxkap5qbGFmaGltH/D2Q0BDIyaHpnsDAyQCCIz8JQklpcwsAAAKyOI8I=";



const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const router = useRouter(); // <-- New line



const localTracks = { audioTrack: null, videoTrack: null };

const remoteUsers = ref([]);

const micOn = ref(true);

const camOn = ref(true);



const joinCall = async () => {

try {

await client.join(appId, channel, token);



localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();



const localPlayer = document.getElementById("local-player");

if (localPlayer) {

  localTracks.videoTrack.play(localPlayer);

} else {

  console.error("Local video player element not found.");

}



await client.publish(Object.values(localTracks));



// Handle remote user publication

client.on("user-published", async (user, mediaType) => {

  await client.subscribe(user, mediaType);

  if (mediaType === "video") {

    remoteUsers.value.push(user.uid);



    // Wait for the DOM to update before playing the video

    await nextTick();

    const remotePlayer = document.getElementById(`player-${user.uid}`);

    if (remotePlayer) {

      user.videoTrack.play(remotePlayer);

    } else {

      console.error(`Remote video player element for user ${user.uid} not found.`);

    }

  }

  if (mediaType === "audio") {

    user.audioTrack.play();

  }

});



// Handle remote user unpublication

// Handle remote user unpublication

client.on("user-unpublished", (user) => {

  remoteUsers.value = remoteUsers.value.filter((id) => id !== user.uid);

});

} catch (error) {

console.error("Failed to join or publish to the call:", error);

// You might want to display a user-friendly error message here

}

};



const leaveCall = async () => {

  for (let track of Object.values(localTracks)) {

    if (track) track.stop(), track.close();

  }

  await client.leave();

  remoteUsers.value = [];

  router.push("/home"); // <-- Redirects to the home page after leaving the call

};



const toggleMic = async () => {

micOn.value = !micOn.value;

if (localTracks.audioTrack) {

await localTracks.audioTrack.setEnabled(micOn.value);

}

};



const toggleCam = async () => {

camOn.value = !camOn.value;

if (localTracks.videoTrack) {

await localTracks.videoTrack.setEnabled(camOn.value);

}

};



onMounted(joinCall);

onUnmounted(leaveCall);

</script>