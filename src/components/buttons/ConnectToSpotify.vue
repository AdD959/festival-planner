<script setup>
    import ButtonShadow from './ButtonShadow.vue'
</script>

<template>
    <div>
        <label for="connect-to-spotify" class="block text-xs">Connect to Spotify</label>
        <button aria-label="connect-to-spotfiy" class="relative p-2 bg-skin-base border-2 border-skin-muted text-skin-inverted flex items-center">
            <ButtonShadow />
            Connect
            <img class="w-5 ml-2" src="../../assets/Spotify_icon.svg.png" alt="Spotify Icon">
        </button>
    </div>
</template>