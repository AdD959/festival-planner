<template>
    <span class="p-2 rounded-md text-skin-quaternary inline-block">
        <p class="text-red-600">{{ msg }}</p>
    </span>
</template>

  <script>
    export default {
      props: { msg: String, showError: Boolean },
    }
  </script>