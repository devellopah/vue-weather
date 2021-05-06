<template>
  <div class="bg-blue-100 text-center py-10">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto">
    <svg class="inline-svg-icon">
      <use xlink:href="#day"></use>
    </svg>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      city: null,
      region: null,
      loc: null,
    }
  },
  mounted() {
    this.getLoc()
  },
  methods: {
    async getLoc() {
      try {
        const { data } = await this.axios.get(`https://ipinfo.io?token=${process.env.VUE_APP_IPINFO_ACCESS_TOKEN}`)
        this.city = data.city
        this.region = data.region
        this.loc = data.loc
      } catch ({ response: { data } }) {
        console.log(data)
          this.$swal({
            title: data.error.title,
            text: data.error.message,
            icon: 'error',
            // confirmButtonText: 'Got it'
          })
      }
    },
  }
}
</script>

<style>
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";
</style>
