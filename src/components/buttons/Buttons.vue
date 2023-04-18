<script setup>
import SelectAFestival from './SelectAFestival.vue'
import ConnectToSpotify from './ConnectToSpotify.vue'
import Print from './Print.vue'
</script>

<template>
    <div class="mt-10 mb-5 flex gap-3">
        <SelectAFestival @festivalSelect="festivalSelect" :festivals="festivals"/>
        <ConnectToSpotify @spotifySync="emitResults" />
        <Print />
    </div>
</template>

<script>
export default {
  emits: ['spotifySync','festivalSelect'],
  props: ['festivals'],
  components: {
    SelectAFestival, ConnectToSpotify, Print
  },
  methods: {
    emitResults(data) {
      this.$emit('spotifySync', data)
    },
    festivalSelect(festival) {
      this.$emit('festivalSelect', festival)
    }
  }
}
</script>