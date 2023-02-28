<template>
    <div>
        <div class="w-full h-full absolute bg-skin-inverted text-skin-base transition-all duration-100" :class="open ? 'right-0' : '-right-[110%]'">
        </div>
        <button class="absolute text-skin-base py-2 px-4 bg-skin-inverted top-0 right-0" @click="open = !open" v-text="open ? 'X' : 'Test'" ></button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
}
</script>