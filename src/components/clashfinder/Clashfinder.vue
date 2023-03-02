<script setup>
    import Error from '../errors/Generic.vue'
</script>

<template>
    <p>
        THIS IS THE CLASHFINDER FOR: {{ festival }}
    </p>
    <Error msg="Sorry, this clashfinder isn't currently available." :showError="error"/>
</template>

<script>
export default {
    props: { festival: String },
    data() {
        return {
            previousSelections: [],
            error: false,
        }
    },
    updated() {
        if (!this.previousSelections.includes(this.festival)) {
            this.previousSelections.push(this.festival)
            this.requestClashfinder(this.festival)
        } else {

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
            // .then(json => { this.createTable(json); return json })
        }
    }
}
</script>