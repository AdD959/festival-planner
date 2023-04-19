<template>
    <div class="p-2 rounded-md inline-block">
        <p class="text-red-600">{{ msg }}</p>
    </div>
</template>

  <script>
    export default {
      props: { msg: String },
    }
  </script>