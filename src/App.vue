<script setup>
  import SpotifyConnect from './components/SpotifyConnect.vue'
  import Clashfinder from './components/Clashfinder.vue'
</script>

<template>
  <main class="w-[700px]">
    <h1 class="text-5xl font-bold mt-20">Festival Planner</h1>
    <!-- <SpotifyConnect /> -->
    <div class="mt-10">
      <h2 class="text-sm">Choose your festival</h2>
      <!-- <Glastonbury /> -->
      <select class="p-2 bg-blue-200 mb-2 rounded-md" ref="selector" v-model="festival" @change="switchClashfinder()">
        <option value="null" disabled selected hidden>Select</option>
        <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
        <option value="leeds-2022">Leeds Festival 2022</option>
      </select>
    </div>
    <!-- <Clashfinder :festivalData="festivalData" :festival="festival" :error="error" /> -->
    <div id="visualization"></div>
  </main>
</template>

<script>
  export default {
    data() {
      return {
        festival: null,
        festivalData: [],
        error: null
      }
    },
    mounted() {
      //testing only
      this.festival = 'glastonbury-2022'
      let promise = new Promise((resolve, reject) => {
        // do some asynchronous work
        // let result = this.switchClashfinder(this.festival);

        this.switchClashfinder(this.festival)
        .then(result => resolve(result))
        .catch(err => reject(err));

        // if (result) {
        //   // if successful, resolve the Promise
        //   console.log('success!')
        //   resolve(result);
        // } else {
        //   // if unsuccessful, reject the Promise
        //   reject(new Error('Something went wrong'));
        //   console.log('failure...')
        // }
      });

      promise.then(x => {console.log(x)})
    },
    methods: {
      async switchClashfinder(input) {
        // pt.1 read json and send to DOM
        const url = input ? input : this.festival
        this.festivalData = await fetch(`${url}.json`)
        .then(response => { 
          if (response.status === 404) {
            this.error = `Sorry, this festival doesn't have an available clashfinder.`
            return []
          }
          this.error = null
          return response.json()
        })
        .catch(error => {
          this.error = `Sorry, there seems to be a bug. Please report this to the developer.`
          console.log(error)
        });
      },
      createTable(json) {
        var container = document.getElementById('visualization');
        console.log(json.resolve())
        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet([
          {id: 1, order: 2, group: 1, content: 'item 1', start: '2014-04-18 10:00:00', end: '2014-04-18 11:00:00'},
          {id: 2, order: 3, group: 2, content: 'item 2', start: '2014-04-18 10:00:00', end: '2014-04-18 11:00:00'},
          {id: 3, order: 1, group: 3, content: 'item 3', start: '2014-04-18 10:00:00', end: '2014-04-18 11:00:00'},
          {id: 4, content: 'item 4', group: 1, start: '2014-04-18 11:15:00', end: '2014-04-18 18:00:00'},
          {id: 5, content: 'item 5', group: 2, start: '2014-04-18 13:00:00'},
          {id: 6, content: 'item 6', group: 2, start: '2014-04-18 14:00:00', end: '2014-04-18 15:00:00', type: 'point'},
          {id: 7, content: 'item 6', group: 2, start: '2014-04-18 22:00:00', end: '2014-04-18 24:00:00', type: 'point'}
        ]);

        var groups = [
          {
            id: 1,
            content: 'John Peel'
            // Optional: a field 'className', 'style', 'order', [properties]
          },
          {
            id: 2,
            content: 'Pyramid'
            // Optional: a field 'className', 'style', 'order', [properties]
          }
          ,
          {
            id: 3,
            content: 'Other'
            // Optional: a field 'className', 'style', 'order', [properties]
          }
        ]
      
        // Configuration for the Timeline
        var options = {
          min: '2014-04-18',
          max: '2014-04-19 08:00:00',
        };
      
        // Create a Timeline
        var timeline = new vis.Timeline(container, items, groups, options);
      }
    },
  }
</script>