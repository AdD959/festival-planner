<template>
    <div class="p-2 rounded-md bg-red-300 inline-block">
        <p class="text-red-600">{{ message }}</p>
    </div>
</template>

  <script>
    export default {
      props: { message: String },
    }
  </script>