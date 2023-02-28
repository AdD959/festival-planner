<script setup>
import Buttons from './components/buttons/Buttons.vue'
</script>


<template>
  <main class="w-full max-w-[1080px] relative text-skin-inverted">
    <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
    <Buttons />
  </main>
</template>

<script>
export default {
  components: {
    Buttons
  }
}
</script>