<script setup>
  import SpotifyConnect from './components/SpotifyConnect.vue'
  import Clashfinder from './components/Clashfinder.vue'
</script>

<template>
  <main class="w-[700px]">
    <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
    <!-- <SpotifyConnect /> -->
    <div class="mt-10">
      <h2 class="text-sm">Choose your festival</h2>
      <!-- <Glastonbury /> -->
      <select class="p-2 bg-blue-200 mb-2 rounded-md" ref="selector" v-model="festival" @change="switchClashfinder()">
        <option value="null" disabled selected hidden>Select</option>
        <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
        <option value="leeds-2022">Leeds Festival 2022</option>
      </select>
    </div>
    <Clashfinder :festivalData="festivalData" :festival="festival" :error="error" />
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
      //testing only
      this.festival = 'glastonbury-2022'
      this.switchClashfinder(this.festival)
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
          this.error = null;
          return response.json() 
        })
        .catch(error => {
          this.error = `Sorry, there seems to be a bug. Please report this to the developer.`
          console.log(error)
        });
      },
    },
  }
</script>