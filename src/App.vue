<script setup>
import SpotifyConnect from './components/SpotifyConnect.vue'
import Clashfinder from './components/Clashfinder.vue'
import Spotify from './components/Spotify.vue'
import Test from './components/glastonbury/Test.vue'
</script>

<template>
  <main class="w-full max-w-[1080px] relative">
    <h1 class="text-5xl font-bold mt-20"><a href="/">Festival Planner</a></h1>
    <!-- <SpotifyConnect /> -->
    <div class="mt-10 flex gap-3">
      <div>
        <h2 class="text-sm">Choose your festival</h2>
        <select class="p-2 bg-blue-200 mb-2 cursor-pointer rounded-md" ref="selector" v-model="festival"
          @change="switchClashfinder()">
          <option value="null" disabled selected hidden>Select</option>
          <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
          <option value="leeds-2022">Leeds Festival 2022</option>
        </select>
      </div>
      <div>
        <Spotify @spotify-sync="syncSpotify" />
      </div>
      <div>
        <h2 class="text-sm">Print your clashfinder</h2>
        <button @click="syncSpotify"
          class="border hover:bg-gray-200 border-slate-900 py-[5px] px-4 mb-2 rounded-md flex justify-center">
          Print
        </button>
      </div>
    </div>
    <p class="text-red-500">{{ error }}</p>
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
      error: null,
      timelines: [],
      containers: [],
      count: 0,
      datasets: [],
    }
  },
  mounted() {
    this.switchClashfinder('glastonbury-2022')
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
        .then(json => { this.createTable(json); return json })
        .catch(error => {
          this.error = `Sorry, there seems to be a bug. Please report this to the developer.`
          console.log(error)
        });
    },
    syncSpotify(spotifyArtists) {
      let spotifyArr = Object.keys(spotifyArtists)
      const matches = []

      this.festivalData.forEach(day =>
        day.Artists.forEach(artist => {
          spotifyArr.forEach(s_artist => {
            const s_artist_upper = s_artist.toUpperCase()
            if (s_artist_upper.includes(artist.content)) {
              matches.push(artist.id)
            }
          })
        }))
      this.timelines.forEach((t,i) => {
        t.setSelection(matches);
        t.on('itemover', function (event) {
          var itemId = event.item;
          console.log(this.$data.datasets)
          var item = this.datasets[i].get(itemId);
          item.className = 'myClass';
          items.update(item);
        });
      })
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

      json.forEach((day, i) => {
        let dataset = new vis.DataSet(day.Artists)
        this.containers.push(document.getElementById(`visualization_${i}`))
        const timeline = new vis.Timeline(this.containers[i], dataset, groups, options[i])
        this.timelines.push(timeline)
      })
    }
  },
}
</script>