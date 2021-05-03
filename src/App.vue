<template>
  <div class="bg-blue-100 text-center py-10">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";
</style>
