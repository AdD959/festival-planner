<script setup>
import SpotifyConnect from './components/SpotifyConnect.vue'
import Clashfinder from './components/Clashfinder.vue'
</script>

<template>
  <main class="w-full max-w-[1080px]">
    <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
    <!-- <SpotifyConnect /> -->
    <div class="mt-10 flex gap-3">
      <div>
        <h2 class="text-sm">Choose your festival</h2>
        <!-- <Glastonbury /> -->
        <select class="p-2 bg-blue-200 mb-2 cursor-pointer rounded-md" ref="selector" v-model="festival" @change="switchClashfinder()">
          <option value="null" disabled selected hidden>Select</option>
          <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
          <option value="leeds-2022">Leeds Festival 2022</option>
        </select>
      </div>
      <div>
        <h2 class="text-sm">Sync with Spotify</h2>
        <button class="bg-slate-900 py-[6px] px-4 mb-2 rounded-md text-white hover:bg-slate-700 flex justify-center">
          Connect
          <img class="w-5 ml-2" src="./assets/Spotify_icon.svg.png" alt="Spotify Icon">
        </button>
      </div>
      <div>
        <h2 class="text-sm">Print your clashfinder</h2>
        <button
          class="border hover:bg-gray-200 border-slate-900 py-[6px] px-4 mb-2 rounded-md flex justify-center">
          Print
        </button>
      </div>
    </div>
    <p class="text-red-500">{{  error  }}</p>
    <!-- <Clashfinder :festivalData="festivalData" :festival="festival" :error="error" /> -->
    <div id="visualization_0" class="mb-2"></div>
    <div id="visualization_1" class="mb-2"></div>
    <div id="visualization_2" class="mb-2"></div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      festival: null,
      festivalData: [],
      error: null
    }
  },
  mounted() {
    // this.switchClashfinder('glastonbury-2022')
  },
  methods: {
    async switchClashfinder(input) {
      // pt.1 read json and send to DOM
      const url = input ? input : this.festival
      this.festivalData = await fetch(`${url}.json`)
        .then(response => {
          if (response.status === 404) {
            this.error = `Sorry, this festival doesn't have an available clashfinder.`
            return []
          }
          this.error = null
          return response.json()
        })
        .then(json => this.createTable(json))
        .catch(error => {
          this.error = `Sorry, there seems to be a bug. Please report this to the developer.`
          console.log(error)
        });
    },
    createTable(json) {
      var groups = [
        { id: 1, content: 'Pyramid' },
        { id: 2, content: 'Other' },
        { id: 3, content: 'West Holts' },
        { id: 4, content: 'John Peel' },
        { id: 5, content: 'The Park' },
        { id: 6, content: 'Acoustic' }
      ]

      var options = [
        {
          min: '2022-02-16 10:30:00',
          max: '2022-02-17 01:00:00',
          zoomFriction: 10,
          zoomMin: 3000000,
          multiselect: true,
          showTooltips: true,
        },
        {
          min: '2022-02-17 10:30:00',
          max: '2022-02-18 01:00:00',
          zoomFriction: 10,
          zoomMin: 3000000,
          multiselect: true,
          showTooltips: true,
        },
        {
          min: '2022-02-18 10:30:00',
          max: '2022-02-19 01:00:00',
          zoomFriction: 10,
          zoomMin: 3000000,
          multiselect: true,
          showTooltips: true,
        }
      ]

      const timelines = []
      const containers = []
      json.forEach((day, i) => {
        containers.push(document.getElementById(`visualization_${i}`))
        const timeline = new vis.Timeline(containers[i], day.Artists, groups, options[i])
        timelines.push(timeline)
      })
    }
  },
}
</script>