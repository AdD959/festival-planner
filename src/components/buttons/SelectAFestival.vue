<script setup>
import ButtonShadow from './ButtonShadow.vue'
</script>

<template>
    <div>
        <label for="select-a-festival" class="block text-xs">Select your festival</label>
        <div class="relative inline-block group text-skin-inverted border-2 border-skin-muted">
            <ButtonShadow />
            <select name="select-a-festival" class="w-full h-full p-[9.5px] bg-skin-accent cursor-pointer outline-none"
                v-model="selectedFestival">
                <option value="null" disabled selected hidden>Select</option>
                <option v-for="(name, i) in formattedFestivals" :value="this.festivals[i]">{{ name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedFestival: null,
        }
    },
    props: ['festivals'],
    emits: ['festivalSelect', 'requestClashfinder'],
    computed: {
        formattedFestivals() {
            return this.festivals.map(festival => {
                return festival.split('-').map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1)
                }).join(' ')
            })
        }
    },
    watch: {
        selectedFestival() {
            this.$emit('festivalSelect', this.selectedFestival)
        }
    }
}
</script>