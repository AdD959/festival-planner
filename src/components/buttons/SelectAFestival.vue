<script setup>
    import ButtonShadow from './ButtonShadow.vue'
</script>

<template>
    <div>
        <label for="select-a-festival" class="block text-xs">Select your festival</label>
        <div class="relative inline-block group text-skin-inverted border-2 border-skin-muted">
            <ButtonShadow />
            <select name="select-a-festival" class="w-full h-full p-[9.5px] bg-skin-accent cursor-pointer outline-none">
                <option value="null" disabled selected hidden>Select</option>
                <option value="glastonbury-2022" selected>Glastonbury Festival 2022</option>
                <option value="leeds-2022">Leeds Festival 2022</option>
            </select>
        </div>
    </div>
</template>

