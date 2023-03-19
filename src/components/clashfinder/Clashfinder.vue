<script setup>
import Error from '../errors/Generic.vue'
import Loading from '../animations/Loading.vue'
</script>

<template>
    <div id="container">
        <div v-for="festival in festivals" :id="festival">
            <Error class="error hidden" msg="Sorry, this clashfinder isn't currently available." />
        </div>
    </div>
    <Loading :show="loading"/>
</template>

<script>
export default {
    props: { festival: String, festivals: Array },
    data() {
        return {
            timelines: [],
            loading: false,
            target: null
        }
    },
    watch: {
        festival() {
            document.querySelectorAll('#container > div').forEach(x => x.classList.add('hidden'))
            this.target = document.querySelector(`#${this.festival}`)
            if (this.target.querySelector(':scope > *:not(.error)') !== null) {
                this.target.classList.remove('hidden')
            } else {
                this.target.classList.remove('hidden')
                this.requestClashfinder()
            }
        }
    },
    methods: {
        async requestClashfinder() {
            // const url = input ? input : this.festival
            let errorStatus = false
            this.festivalData = await fetch(`${this.festival}.json`)
                .then(response => {
                    let error = this.target.querySelector('.error')
                    if (response.ok) {
                        this.target.classList.remove('hidden')
                        error.classList.add('hidden')
                        return response.json()
                    }
                    errorStatus = true
                    error.classList.remove('hidden')
                })
                .then(json => {
                    if (!errorStatus) {
                        this.createTable(json)
                    }
                })
        },
        createTable(json) {
            const div = document.createElement('div')
            const div_inner = document.createElement('div')
            div.id = this.festival
            div_inner.classList.add('inner')
            div.appendChild(div_inner)
            document.querySelector('#container').appendChild(div)

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
                },
            ]

            let container = document.querySelector(`#${this.festival}`)
            container.classList.add('h-0', 'overflow-hidden')
            container
            json.forEach((day, i) => {
                // create new dataset
                let dataset = new vis.DataSet(day.Artists)
                const timeline = new vis.Timeline(container, dataset, groups, options[i])

                // create tabs
                const tab = document.createElement('button')
                tab.classList.add('flex-1','flex','justify-center','p-4','bg-skin-accent')
                tab.innerHTML = day.Day
                document.querySelectorAll(`#${this.festival} > .vis-timeline`)[i].classList.add(`${day.Day}`)
                
                if (i > 0) {
                    document.querySelectorAll(`#${this.festival} > .vis-timeline`)[i].classList.add('hidden')
                    // document.querySelectorAll(`#${this.festival} > .vis-loading-screen`)[i].classList.add('hidden')
                }

                tab.addEventListener('click', () => {
                    document.querySelectorAll(`#${this.festival} > .vis-timeline:not(.${day.Day})`).forEach(x => x.classList.add('hidden'))
                    document.querySelector(`#${this.festival} > .${day.Day}`).classList.remove('hidden')
                })

                if (i === 0) { 
                    this.loading = true
                    const tabContainer = document.createElement('div')
                    tabContainer.id = `tabContainer_${this.festival}`
                    tabContainer.classList.add('flex','w-full','gap-2','mb-1')
                    container.prepend(tabContainer)
                }
                
                document.querySelector(`#tabContainer_${this.festival}`).appendChild(tab)

                timeline.on("currentTimeTick", () => {
                    container.classList.remove('h-0')
                    timeline.off("currentTimeTick")
                    this.loading = false
                })
                this.timelines.push(timeline)

            })
        }
    }
}
</script>