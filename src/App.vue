<script setup>
import Buttons from './components/buttons/Buttons.vue'
import TestBar from './components/development/TestBar.vue'
import Clashfinder from './components/clashfinder/Clashfinder.vue'
</script>


<template>
  <div class="flex flex-col w-full">
    <div class="relative text-skin-inverted max-w-[1080px]">
      <h1 class="text-5xl font-bold mt-5">Festival Planner</h1>
      <Buttons @festivalSelect="festivalSelected" :festivals="festivals"/>
    </div>
    <Clashfinder :festival="currentFestival" :festivals="festivals"/>
  </div>
  <TestBar v-show="env === 'dev'" />
</template>

<script>
export default {
  data() {
    return {
      env: import.meta.env.VITE_ENVIRONMENT,
      currentFestival: '',
      festivals: [
        'glastonbury-2022',
        'glastonbury-2021',
        'leeds-2023'
      ]
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