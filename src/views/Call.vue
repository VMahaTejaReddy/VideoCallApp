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
import { ref, onMounted, onUnmounted } from "vue";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = "77698182beba4a72acabfb32e7538619"; // from Agora Console
const channel = "test"; // you can use a dynamic one
const token = "007eJxTYFhTrWmt+sFs/31fiS8XuU+e2mL5/+WCxTmnz2k+OM16/9o7BQZzczNLC0MLo6TUpESTRHOjxOTEpLQkY6NUc1NjCzNDS4Y3+zMaAhkZ/qYVMDIyQCCIz8JQklpcwsAAAEiyIzE="; // for testing, null works if app certificate is disabled

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const localTracks = { audioTrack: null, videoTrack: null };
const remoteUsers = ref([]);
const micOn = ref(true);
const camOn = ref(true);

const joinCall = async () => {
  await client.join(appId, channel, token);

  localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();

  const localPlayer = document.getElementById("local-player");
  localTracks.videoTrack.play(localPlayer);

  await client.publish(Object.values(localTracks));

  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      remoteUsers.value.push(user.uid);
      user.videoTrack.play(`player-${user.uid}`);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  });

  client.on("user-unpublished", (user) => {
    remoteUsers.value = remoteUsers.value.filter((id) => id !== user.uid);
  });
};

const leaveCall = async () => {
  for (let track of Object.values(localTracks)) {
    if (track) track.stop(), track.close();
  }
  await client.leave();
  remoteUsers.value = [];
};

const toggleMic = async () => {
  micOn.value = !micOn.value;
  if (micOn.value) {
    await localTracks.audioTrack.setEnabled(true);
  } else {
    await localTracks.audioTrack.setEnabled(false);
  }
};

const toggleCam = async () => {
  camOn.value = !camOn.value;
  if (camOn.value) {
    await localTracks.videoTrack.setEnabled(true);
  } else {
    await localTracks.videoTrack.setEnabled(false);
  }
};

onMounted(joinCall);
onUnmounted(leaveCall);
</script>
