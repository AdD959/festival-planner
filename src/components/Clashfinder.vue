<script setup>
  // import Glastonbury from '../components/glastonbury/Glastonbury.vue'
  import Error from '../components/errors/Generic.vue'
</script>

<template>
  <div v-if="error"><Error :message="error"/></div>
  <div v-else>
    <div class="mt-10">
      <h2 class=" text-4xl">{{ format(festival) }}</h2>

    </div>
  </div>
</template>

<script>
  export default {
    props: { festivalData: Array, festival: String, error: String },
    methods: {
      format(string) {
        if (string === null) { return }
        
        let words = string.split("-");
        words.forEach((el, i) => {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        });
        return words.join(" ");
      }
    }
  }
</script>