<script setup>
import Buttons from './components/buttons/Buttons.vue'
import TestBar from './components/development/TestBar.vue'
</script>


<template>
  <main class="relative text-skin-inverted max-w-[1080px]">
    <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
    <Buttons @festivalSelect="festivalSelected"/>
  </main>
  <TestBar v-show="env === 'dev'" />
</template>

<script>
export default {
  data() {
    return {
      env: import.meta.env.VITE_ENVIRONMENT
    }
  },
  components: {
    Buttons, TestBar
  },
  methods: {
    festivalSelected(festival) {
      console.log(festival)
    }
  }
}
</script>