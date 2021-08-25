<template>
<div :class="[isForecastAvailable ? 'bg-indigo-500' : '', 'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center']">
  <div :class="[isPreviousResultMessageShown ? 'block' : 'hidden' ,'absolute bg-white w-full top-0 text-center text-grey-900 py-1']">
    The recent successful resut is shown
  </div>
  <div class="w-full flex flex-col items-center justify-center rounded-lg shadow-2xl mx-4" style="max-width: 25rem;" v-if="isForecastAvailable">
    <div class="w-full bg-gray-100 relative rounded-t-lg">

      <the-icon :icon="icon"/>

      <div class="w-full flex items-center relative mb-4">
        <the-temperature :value="forecast.temperature" />
        <div class="leading-normal ml-4">
          <the-description :value="description" />
          <the-location :name="location.name"  :country="location.country" />
        </div>
        <the-date :month="month" :day="day" />
      </div>
    </div>
    <div class="font-montserrat w-full text-white text-sm font-bold bg-gray-900 rounded-b-xl flex items-start justify-between flex-grow py-12 px-4 sm:px-12">
      <div class="flex items-center">
        <svg class="mr-4" width="30" height="19">
          <use xlink:href="#wind-speed"></use>
        </svg>
        <span>{{forecast.wind_speed}}</span><span>KM/H</span>
      </div>
      <div class="flex items-center">
        <svg class="mr-4" width="16" height="20">
          <use xlink:href="#humidity"></use>
        </svg>
        <span>{{forecast.humidity}}</span><span>%</span>
      </div>
      <div class="flex items-center">
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

import icons from './icons'

import TheIcon from './components/TheIcon.vue'
import TheTemperature from './components/TheTemperature.vue'
import TheLocation from './components/TheLocation.vue'
import TheDescription from './components/TheDescription.vue'
import TheDate from './components/TheDate.vue'


const fullConfig = resolveConfig(tailwindConfig)
const STORAGE_PREFIX = 'vue_weather_'

export default {
  name: 'App',
  components: {
    PacmanLoader,
    TheIcon,
    TheTemperature,
    TheLocation,
    TheDescription,
    TheDate,
  },
  data() {
    return {
      location: null,
      forecast: null,
      isPreviousResultMessageShown: false,
      loader: {
        color: fullConfig.theme.backgroundColor.green['500'],
      },
    }
  },
  computed: {
    isForecastAvailable() {
      return Boolean(this.forecast)
    },
    isCachedForecastAvailable() {
      return Boolean(JSON.parse(sessionStorage.getItem(STORAGE_PREFIX + 'forecast')))
    },
    icon() {
      const { weather_code, is_day } = this.forecast

      return is_day == 'yes' || icons[weather_code].length === 1
      ? icons[weather_code][0]
      : icons[weather_code][1]
    },
    day() {
      return dayjs().date()
    },
    month() {
      return dayjs().format('MMM')
    },
    description() {
      const arr = this.forecast.weather_descriptions[0].split(' ')
      return arr.length > 1 ? arr[0] + ' ' + arr[1] : arr[0]
    },
  },
  async mounted() {
    try {
      const coords = await this.getCoords()
      const data = await this.getForecast(coords)
      this.displayInfo(data)
      this.cacheInfo(data)
      console.log('forecast has been cached!')
    } catch(_) {
      if(this.isCachedForecastAvailable) {
        console.log('forecast has been retrieved from cache!')
        this.displayCachedInfo()
      }
    }
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
          })
      }
    },
    async getForecast(coords) {
      try {
        const url = `${process.env.VUE_APP_WEATHER_API_URL}?coords=${coords}&unit=m`
        const { data } = await this.axios.get(url)
        console.log(data)
        return data
      } catch ({ response }) {
        console.log('response', response)
        this.handleError(response)
      }
    },
    handleError({ statusText, data: { resetTime } }) {
      this.$swal({
        title: statusText,
        text: `Try again later in ${dayjs(new Date(resetTime)).diff(dayjs(new Date()), 'minute')} minutes`,
        icon: 'error',
      })
    },
    displayCachedInfo() {
      const location = JSON.parse(sessionStorage.getItem(STORAGE_PREFIX + 'location'))
      const forecast = JSON.parse(sessionStorage.getItem(STORAGE_PREFIX + 'forecast'))

      this.showPreviousResultMessage()
      this.displayInfo({location, forecast})
    },
    displayInfo(data) {
      this.location = data.location
      this.forecast = data.forecast
    },

    cacheInfo(data) {
      sessionStorage.setItem(STORAGE_PREFIX + 'location', JSON.stringify(data.location))
      sessionStorage.setItem(STORAGE_PREFIX + 'forecast', JSON.stringify(data.forecast))
    }
  }
}
</script>

<style lang="postcss">
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";

.swal2-modal,
button {
  @apply font-montserrat;
}
.swal2-modal .swal2-styled {
  @apply px-5;
}
.temperature:after {
  @apply w-2 h-2 border-gray-600 border absolute right-0 rounded-full;
  content: "";
  top: 0.75rem;
}
</style>
