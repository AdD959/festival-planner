<script setup>
import SelectAFestival from './SelectAFestival.vue'
import ConnectToSpotify from './ConnectToSpotify.vue'
import Print from './Print.vue'
</script>

<template>
    <div class="mt-10 mb-5 flex gap-3">
        <SelectAFestival @festivalSelect="festivalSelect"/>
        <ConnectToSpotify/>
        <Print />
    </div>
</template>

<script>
export default {
  components: {
    SelectAFestival, ConnectToSpotify, Print
  },
  methods: {
    festivalSelect(festival) {
      this.$emit('festivalSelect', festival)
    }
  }
}
</script>