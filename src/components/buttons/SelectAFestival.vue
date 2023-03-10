<script setup>
    import ButtonShadow from './ButtonShadow.vue'
</script>

<template>
    <div>
        <label for="select-a-festival" class="block text-xs">Select your festival</label>
        <div class="relative inline-block group text-skin-inverted border-2 border-skin-muted">
            <ButtonShadow />
            <select name="select-a-festival" class="w-full h-full p-[9.5px] bg-skin-accent cursor-pointer outline-none" v-model="festival">
                <option value="null" disabled selected hidden>Select</option>
                <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
                <option value="leeds-2022">Leeds Festival 2022</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            festival: null
        }
    },
    emits: ['festivalSelect', 'requestClashfinder'],
    watch: {
        festival() {
            if (document.querySelector(`#${this.festival}`)) {
                document.querySelectorAll('#container > div').forEach(festival => {
                    console.log(festival.id)
                    if (festival.id !== this.festival) { 
                        console.log('adding hidden...')
                        festival.classList.add('hidden') 
                    } else {
                        console.log('removing hidden for ' + festival.id)
                        festival.classList.remove('hidden')
                    }  
                })
            } else {
                document.querySelectorAll('#container > div').forEach(festival => { festival.classList.add('hidden') })
                this.$emit('festivalSelect', this.festival)
            }
        }
    }
}
</script>