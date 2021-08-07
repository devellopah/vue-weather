<template>
<div :class="[isLoaded ? 'bg-indigo-500' : '', 'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center']">
  <div :class="[isPreviousResultMessageShown ? 'block' : 'hidden' ,'absolute bg-white w-full top-0 text-center text-grey-900 py-1']">
    The recent successful resut is shown
  </div>
  <div class="app mx-4" v-if="isLoaded">
    <div class="w-full bg-gray-100 relative rounded-t-lg">
      <svg class="w-64 h-64 mx-auto">
        <use :xlink:href="mainIcon"></use>
      </svg>
      <div class="w-full flex items-center relative">
        <div class="app__temp">{{forecast.temperature}}</div>
        <div class="leading-normal ml-4">
          <div class="text-gray-600 font-light text-2xl">
            {{forecast.weather_descriptions[0]}}
          </div>
          <div class="font-semibold text-gray-700">
            {{`${location.name}, ${location.country}`}}
          </div>
        </div>
        <div class="app__date">
          <span class="text-sm">{{ month }}</span>
          <span class="text-lg">{{ day }}</span>
        </div>
      </div>
    </div>
    <div class="app__bottom sm:px-12">
      <div class="meta-block flex items-center">
        <svg class="mr-4" width="30" height="19">
          <use xlink:href="#wind-speed"></use>
        </svg>
        <span>{{forecast.wind_speed}}</span><span>KM/H</span>
      </div>
      <div class="meta-block flex items-center">
        <svg class="mr-4" width="16" height="20">
          <use xlink:href="#humidity"></use>
        </svg>
        <span>{{forecast.humidity}}</span><span>%</span>
      </div>
      <div class="meta-block flex items-center">
        <svg class="mr-4" width="22" height="22">
          <use xlink:href="#cloudiness"></use>
        </svg>
        <span>{{forecast.cloudcover}}</span><span>%</span>
      </div>
    </div>
  </div>
  <pacman-loader :color="loader.color" v-else></pacman-loader>
</div>
</template>

<script>
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import dayjs from 'dayjs'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

import code2icon from './code2icon'

const fullConfig = resolveConfig(tailwindConfig)

export default {
  name: 'App',
  components: {
    PacmanLoader
  },
  data() {
    return {
      location: null,
      forecast: null,
      resetTime: null,
      isPreviousResultMessageShown: false,
      loader: {
        color: fullConfig.theme.backgroundColor.green['500'],
      },
    }
  },
  computed: {
    isLoaded() {
      return Boolean(this.forecast)
    },
    mainIcon() {
      const { weather_code, is_day } = this.forecast

      return is_day == 'yes' || code2icon[weather_code].length === 1
      ? code2icon[weather_code][0]
      : code2icon[weather_code][1]
    },
    day() {
      return dayjs().date()
    },
    month() {
      return dayjs().format('MMMM')
    },
  },
  async mounted() {
    const coords = await this.getCoords()
    await this.getForecast(coords)
  },
  methods: {
    showPreviousResultMessage() {
      this.isPreviousResultMessageShown = true
    },
    hidePreviousResultMessage() {
      this.isPreviousResultMessageShown = false
    },
    async getCoords() {
      try {
        const {data: coords} = await this.axios.get(`https://ipinfo.io/loc?token=${process.env.VUE_APP_IPINFO_ACCESS_TOKEN}`)
        return coords
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
    async getForecast(coords) {
      try {
        const url = `${process.env.VUE_APP_WEATHER_API_URL}?coords=${coords}&unit=m`
        const { data } = await this.axios.get(url)
        console.log(data)
        this.displayInfo(data)
        this.storeInfo(data)

      } catch ({ response: { status, statusText, data } }) {
        console.log('error data', data)
        if (status === 429) {
          this.resetTime = data.resetTime
          this.$swal({
            title: statusText,
            text: `Try again later in ${dayjs(this.resetTime).diff(dayjs(new Date()), 'minute')} minutes`,
            icon: 'info',
            // background: '#f8f8f8',
            // confirmButtonText: 'Ok, i got it (:'
          })

          const location = JSON.parse(sessionStorage.getItem('location'))
          const forecast = JSON.parse(sessionStorage.getItem('forecast'))

          this.showPreviousResultMessage()
          this.displayInfo({location, forecast})
        }
      }
    },
    displayInfo(data) {
      this.location = data.location
      this.forecast = data.forecast
      this.resetTime = data.resetTime
    },

    storeInfo(data) {
      sessionStorage.setItem('location', JSON.stringify(data.location))
      sessionStorage.setItem('forecast', JSON.stringify(data.forecast))
    }
  }
}
</script>

<style lang="postcss">
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";

.swal2-modal,
button {
  font-family: Montserrat, sans-serif;
}
.swal2-modal .swal2-styled {
  @apply px-5;
}
.app {
  @apply w-full flex flex-col items-center justify-center rounded-lg;
  max-width: 24.3125em;
  -webkit-box-shadow: 10px 18px 20px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 10px 18px 20px 1px rgba(0, 0, 0, 0.15);
}
.app__temp {
  @apply text-6xl inline-block relative leading-tight font-light text-gray-600 px-2;
  font-family: Montserrat, sans-serif;
}
.app__temp:after {
  @apply border-gray-600 border-solid absolute right-0 rounded-full;
  content: "";
  top: 0.267857142857143em;
  width: 0.178571428571429em;
  height: 0.178571428571429em;
  border-width: 0.017857142857143em;
}
.app__location,
.app__summary {
  font-family: Source Sans Pro, sans-serif;
}
.app__date {
  @apply h-full text-white bg-blue-500 font-bold uppercase;
  @apply ml-auto flex flex-col items-center justify-center absolute right-0 top-0 bottom-0;
  min-width: 4.0625em;
  font-family: Open Sans, sans-serif;
}
.app__bottom {
  @apply w-full text-white text-sm font-bold bg-gray-900 rounded-b-xl;
  @apply flex items-start justify-between flex-grow py-12 px-4;
  font-family: Montserrat, sans-serif;
}
</style>
