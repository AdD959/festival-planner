<script setup>
  // import Glastonbury from '../components/glastonbury/Glastonbury.vue'
  import { onUpdated } from 'vue'
</script>

<template>
  <div>
    {{ setList }}
  </div>
  <button @click="colour = !colour" :class="colour ? 'bg-red-500' : 'bg-blue-500'">test</button>
</template>

<script>
  export default {
    props: { festival: String },
    data() {
      return {
        setList: Array,
        colour: true
      }
    },
    methods: {
      async getSetlist() {
        // pt.1 read json and send to DOM
        this.setList = await fetch(`${this.festival}.json`).then(raw => { return raw.json() })
      },
    },
    updated() {
      this.getSetlist()
    }
  }
</script>