<script setup>
    import Error from '../errors/Generic.vue'
</script>

<template>
    <Error msg="Sorry, this clashfinder isn't currently available." :showError="error"/>
</template>

<script>
export default {
    props: { festival: String },
    data() {
        return {
            error: false,
        }
    },
    updated() {
        this.requestClashfinder(this.festival)
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