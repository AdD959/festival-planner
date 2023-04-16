<script setup>
import Error from '../errors/Generic.vue'
import Loading from '../animations/Loading.vue'
</script>

<template>
    <div id="container">
        <div v-for="festival in festivals" :id="festival">
            <Error class="error hidden" msg="Sorry, this clashfinder isn't currently available." />
            <div class="clashfinder">
                <div class="tabs flex gap-1 mb-1"></div>
                <div class="table w-full"></div>
            </div>
        </div>
    </div>
    <Loading :show="loading" />
</template>

<script>
export default {
    props: { festival: String, festivals: Array },
    data() {
        return {
            timelines: [],
            loading: false,
            target: null,
            clashfinder: null,
            table: null,
            tabs: null
        }
    },
    watch: {
        festival() {
            document.querySelectorAll('#container > div').forEach(x => x.classList.add('hidden'))
            this.target = document.querySelector(`#${this.festival}`)
            this.clashfinder = this.target.querySelector(`.clashfinder`)
            this.table = this.target.querySelector(`.table`)
            this.tabs = this.target.querySelector(`.tabs`)
            if (this.table.innerHTML === "") {
                this.requestClashfinder().then(() => this.target.classList.remove('hidden'))
            } else {
                this.target.classList.remove('hidden')
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
        selectTab(day, tabIndex) {
            this.tabs.querySelectorAll('.tabs > button').forEach((tab, i) => {
                if (i !== tabIndex) {
                    tab.classList.remove('border-2')
                } else {
                    tab.classList.add('border-2')
                }
            })

            let tables = this.table.querySelectorAll('.vis-timeline')
            tables.forEach(table => {
                if (table.classList.contains(day)) {
                    table.classList.remove('hidden')
                } else {
                    table.classList.add('hidden')
                }
            })

        },
        createTable(json) {
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
                    showTooltips: true,
                    selectable: false

                },
                {
                    min: '2022-02-17 10:30:00',
                    max: '2022-02-18 01:00:00',
                    zoomFriction: 75,
                    zoomMin: 10000000,
                    showTooltips: true,
                    selectable: false

                },
                {
                    min: '2022-02-18 10:30:00',
                    max: '2022-02-19 01:00:00',
                    zoomFriction: 75,
                    zoomMin: 10000000,
                    showTooltips: true,
                    selectable: false
                },
            ]

            this.clashfinder.classList.add('h-0', 'overflow-hidden')
            json.forEach((day, i) => {
                let dataset = new vis.DataSet(day.Artists)
                const timeline = new vis.Timeline(this.table, dataset, groups, options[i])

                let tab = document.createElement('button')
                tab.innerHTML = day.Day
                tab.classList.add('flex-1', 'bg-skin-accent', 'p-4', 'flex', 'justify-center')
                if (i === 0) { tab.classList.add('border-skin-muted', 'border-2') }
                this.tabs.appendChild(tab)
                this.table.querySelectorAll('.vis-timeline')[i].classList.add(`${day.Day}`)

                tab.addEventListener('click', () => {
                    this.selectTab(day.Day, i)
                })

                this.loading = true
                timeline.on("currentTimeTick", () => {
                    this.clashfinder.classList.remove('h-0')
                    timeline.off("currentTimeTick")
                    this.loading = false

                    document.querySelectorAll('.vis-item-overflow').forEach(item => {
                        item.addEventListener('click', () => {
                            if (item.classList.contains('bg-skin-accent')) {
                                item.classList.remove('bg-skin-accent')
                            } else {
                                item.classList.add('bg-skin-accent')
                            }
                        })
                    })
                })

                this.timelines.push(timeline)
            })
        }
    }
}
</script>