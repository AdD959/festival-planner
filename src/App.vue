<script setup>
  import SpotifyConnect from './components/SpotifyConnect.vue'
  import Clashfinder from './components/Clashfinder.vue'
</script>

<template>
  <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
  <!-- <SpotifyConnect /> -->
  <div class="mt-10">
    <h2 class="text-sm">Choose your festival</h2>
    <!-- <Glastonbury /> -->
    <select class="p-2 bg-blue-200" v-model="selected">
      <option value="null" disabled selected hidden>Select</option>
      <option value="glastonbury2022">Glastonbury Festival 2022</option>
      <option value="leeds2022">Leeds Festival 2022</option>
    </select>
  </div>
  <Clashfinder :festival="selected" />
</template>

<script>
  export default {
    data() {
      return {
        selected: null,
      }
    }
  }
</script>