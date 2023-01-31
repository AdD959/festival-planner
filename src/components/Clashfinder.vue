<script setup>
  // import Glastonbury from '../components/glastonbury/Glastonbury.vue'
</script>

<template>

<div>
  {{ festival }}
</div>

</template>

<script>
  export default {
    props: { festival: String },
    data() {
      return {
        setList: Array
      }
    },
    mounted() {
      this.getSetlist()
    },
    methods: {
      async getSetlist() {
        // pt.1 read json and send to DOM
        fetch(`${this.festival}.json`).then(raw => raw.json()).then(res => { 
            this.setList = res
        })
      },
    }
  }
</script>