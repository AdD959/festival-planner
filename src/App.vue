<script setup>
import Buttons from './components/buttons/Buttons.vue'
import TestBar from './components/development/TestBar.vue'
import Clashfinder from './components/clashfinder/Clashfinder.vue'
</script>


<template>
  <div class="flex flex-col w-full">
    <div class="relative text-skin-inverted max-w-[1080px]">
      <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
      <Buttons @festivalSelect="festivalSelected"/>
    </div>
    <Clashfinder :festival="currentFestival"/>
  </div>
  <TestBar v-show="env === 'dev'" />
</template>

<script>
export default {
  data() {
    return {
      env: import.meta.env.VITE_ENVIRONMENT,
      currentFestival: '',
    }
  },
  components: {
    Buttons, TestBar
  },
  methods: {
    festivalSelected(festival) {
      this.currentFestival = festival
    }
  }
}
</script>