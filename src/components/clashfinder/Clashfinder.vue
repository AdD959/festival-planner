<script setup>
import Error from '../errors/Generic.vue'
import Loading from '../animations/Loading.vue'
</script>

<template>
    <div id="container">
        <Error v-show="showError" msg="Sorry, this clashfinder isn't currently available." />
        <Loading :show="loading"/>
    </div>
</template>

<script>
export default {
    props: { festival: String },
    data() {
        return {
            error: false,
            timelines: [],
            containers: [],
            loading: false
        }
    },
    watch: {
        festival() {
            this.requestClashfinder()
        }
    },
    methods: {
        async requestClashfinder() {
            // const url = input ? input : this.festival
            this.festivalData = await fetch(`${this.festival}.json`)
                .then(response => {
                    if (response.ok) {
                        this.error = false
                        return response.json()
                    }
                    this.error = true
                })
                .then(json => {
                    if (!this.error) {
                        this.createTable(json)
                    }
                })
        },
        createTable(json) {
            if (document.querySelector(`#${this.festival}`)) {
                return
            } else {
                const div = document.createElement('div')
                div.id = this.festival
                document.querySelector('#container').appendChild(div)
            }
            var groups = [
                { id: 1, content: 'Pyramid' },
                { id: 2, content: 'Other' },
                { id: 3, content: 'West Holts' },
                { id: 4, content: 'John Peel' },
                { id: 5, content: 'The Park' },
                { id: 6, content: 'Acoustic' }
            ]

            var options = [
                {
                    min: '2022-02-16 10:30:00',
                    max: '2022-02-17 01:00:00',
                    zoomFriction: 75,
                    zoomMin: 10000000,
                    multiselect: true,
                    showTooltips: true,
                },
                {
                    min: '2022-02-17 10:30:00',
                    max: '2022-02-18 01:00:00',
                    zoomFriction: 75,
                    zoomMin: 10000000,
                    multiselect: true,
                    showTooltips: true,
                },
                {
                    min: '2022-02-18 10:30:00',
                    max: '2022-02-19 01:00:00',
                    zoomFriction: 75,
                    zoomMin: 10000000,
                    multiselect: true,
                    showTooltips: true,
                }
            ]

            json.forEach((day, i) => {
                let dataset = new vis.DataSet(day.Artists)
                let container = document.querySelector(`#${this.festival}`)
                container.classList.add('h-0', 'overflow-hidden')
                this.containers.push(container)
                const timeline = new vis.Timeline(this.containers[i], dataset, groups, options[i])
                if (i === 0) { this.loading = true }
                timeline.on("currentTimeTick", () => {
                    this.containers[i].classList.remove('h-0')
                    timeline.off("currentTimeTick")
                    this.loading = false
                })
                this.timelines.push(timeline)
            })
        }
    }
}
</script>