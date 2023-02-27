<template><button @click="press">PRESS HERE</button></template>

<script>
export default {
    data() {
        return {
            payload: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        press() {
            let test = this.payload
            console.log(this.payload)
        },
        async getData() {
            try {
                this.payload = await fetch(`./glastonbury-2022.json`)
                .then(res => { return res.json() })
                .then(x => this.doSomethingElse(x))
            } catch (error) {
                console.error(error)
            }
        },
        doSomethingElse(x) {
            console.log('doing something else...')
        }
    }
}
</script>