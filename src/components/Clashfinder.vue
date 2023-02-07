<script setup>
  // import Glastonbury from '../components/glastonbury/Glastonbury.vue'
  import Error from '../components/errors/Generic.vue'
</script>

<template>
  <div v-if="error"><Error :message="error"/></div>
  <div v-else>
    <div class="mt-10">
      <h2 class=" text-4xl">{{ format(festival) }}</h2>
      <div class="flex flex-col mb-3">
          <div v-for="day in festivalData" class="items-center flex flex-col">
            <h4 class="font-bold">{{ day.Name }}</h4>
            <div class="flex">
              <div v-for="stage in day.Stages" class="flex flex-col text-center p-4 border-l-2 border-t-2 border-b-2 last:border-r-2">
                <h5>{{ stage.Name }}</h5>
                <div class="bg-gray-600 p-5 flex flex-col gap-2">
                  <div v-for="hour in timescale_hours">
                    <div class="bg-gray-300 h-28">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: { festivalData: Array, festival: String, error: String },
    data() {
      return {
        timescale_hours: 14
      }
    },
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