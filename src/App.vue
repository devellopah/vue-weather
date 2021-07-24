<template>
<div :class="[isLoaded ? 'bg-indigo-500' : 'bg-green-500', 'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center']">
  <div :class="[isPreviousResultMessageShown ? 'block' : 'hidden' ,'absolute bg-white w-full top-0 text-center text-grey-900 py-1']">
    The previous successful resut is shown
  </div>
  <div class="app" v-if="isLoaded">
    <div class="app__top">
      <svg class="app__icon">
        <use :xlink:href="mainIcon"></use>
      </svg>
      <div class="app__data">
        <div class="app__temp">{{forecast.temperature}}</div>
        <div class="app__box">
          <div class="app__summary">
            {{forecast.weather_descriptions[0]}}
          </div>
          <div class="app__location">
            {{`${location.name}, ${location.country}`}}
          </div>
        </div>
        <div class="app__date">
          <span class="app__month">{{ month }}</span>
          <span class="app__day">{{ day }}</span>
        </div>
      </div>
    </div>
    <div class="app__bottom">
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="30" height="19">
          <use xlink:href="#wind-speed"></use>
        </svg>
        <span>{{forecast.wind_speed}}</span><span>KM/H</span>
      </div>
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="16" height="20">
          <use xlink:href="#humidity"></use>
        </svg>
        <span>{{forecast.humidity}}</span><span>%</span>
      </div>
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="22" height="22">
          <use xlink:href="#cloudiness"></use>
        </svg>
        <span>{{forecast.cloudcover}}</span><span>%</span>
      </div>
    </div>
  </div>
  <div class="app" v-else>
    <pacman-loader :loading="true" :color="'#48bb78'"></pacman-loader>
  </div>
</div>
</template>

<script>
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import dayjs from 'dayjs'

const code2icon = {
  113: ['#day', '#night'],
  116: ['#cloudy-day-1', '#cloudy-night-1'],
  119: ['#cloudy-day-2', '#cloudy-night-2'],
  122: ['#cloudy-day-3', '#cloudy-night-3'],
  143: ['#fog'],
  176: ['#rainy-2', '#rainy-4'],
  179: ['#snowy-2', '#snowy-4'],
  182: ['#sleet'],
  185: ['#sleet'],
  200: ['#thunder'],
  227: ['#snow-4'],
  230: ['#snow-5'],
  248: ['#fog'],
  260: ['#fog'],
  263: ['#rainy-2', '#rainy-4'],
  266: ['#rainy-2', '#rainy-4'],
  281: ['#sleet'],
  284: ['#sleet'],
  293: ['#rainy-4'],
  296: ['#rainy-4'],
  299: ['#rainy-3', '#rainy-5'],
  302: ['#rainy-5'],
  305: ['#rainy-3', '#rainy-5'],
  308: ['#rainy-5'],
  311: ['#rainy-2', '#rainy-4'],
  314: ['#rainy-5'],
  317: ['#rainy-4'],
  320: ['#rainy-5'],
  // snow
  323: ['#snowy-2', '#snowy-4'],
  326: ['#snowy-2', '#snowy-4'],
  329: ['#snowy-5'],
  332: ['#snowy-5'],
  335: ['#snowy-1', '#snowy-5'],
  338: ['#snowy-5'],
  350: ['#snowy-4'],
  353: ['#rainy-2', '#rainy-4'],
  356: ['#rainy-1', '#rainy-5'],
  359: ['#rainy-5'],
  362: ['#rainy-2', '#rainy-4'],
  365: ['#rainy-1', '#rainy-5'],
  368: ['#snowy-2', '#snowy-4'],
  371: ['#snowy-1', '#snowy-5'],
  374: ['#snowy-2', '#snowy-4'],
  377: ['#snowy-4'],
  386: ['#thunder'],
  389: ['#thunder'],
  392: ['#thunder'],
  395: ['#thunder'],
}

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

<style>
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";

.swal2-modal,
button {
  font-family: Montserrat, sans-serif;
}
.swal2-modal .swal2-styled {
  padding-left: 20px;
  padding-right: 20px;
}
.app {
  width: 100%;
  max-width: 24.3125em;
  height: 29em;
  background: azure;
  -webkit-box-shadow: 10px 18px 20px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 10px 18px 20px 1px rgba(0, 0, 0, 0.15);
  border-radius: 0.625em;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.app__top {
  width: 100%;
  height: 20.5em;
  background-color: #f1f8f9;
  border-top-left-radius: 0.625em;
  border-top-right-radius: 0.625em;
  position: relative;
}
.app__icon {
  width: 15.625em;
  height: 15.625em;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -65%);
  transform: translate(-50%, -65%);
}
.app__data {
  height: 4.375em;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  bottom: 1.25em;
}
.app__temp {
  color: #8d9396;
  font-size: 3.5em;
  font-weight: 300;
  font-family: Montserrat, sans-serif;
  padding: 0 0.357142857142857em;
  display: inline-block;
  position: relative;
}
.app__temp:after {
  content: "";
  position: absolute;
  right: 0;
  top: 0.267857142857143em;
  width: 0.178571428571429em;
  height: 0.178571428571429em;
  border: 0.017857142857143em solid #8d9396;
  border-radius: 50%;
}
.app__box {
  margin-left: 0.9375em;
  line-height: normal;
}
.app__summary {
  color: #bac2c6;
  font-size: 1.5em;
  font-weight: 300;
}
.app__location,
.app__summary {
  font-family: Source Sans Pro, sans-serif;
}
.app__location {
  color: #a2aaad;
  font-weight: 600;
}
.app__date {
  height: 100%;
  min-width: 4.0625em;
  color: #fff;
  background-color: #54bae6;
  font-family: Open Sans, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  margin-left: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.app__month {
  font-size: 0.875em;
}
.app__day {
  font-size: 1.125em;
}
.app__bottom {
  width: 100%;
  color: #fff;
  font-size: 0.875em;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  background-color: #2e3335;
  border-bottom-left-radius: 0.714285714285714em;
  border-bottom-right-radius: 0.714285714285714em;
  padding: 3em 1em;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
}
@media (min-width: 576px) {
  .app__bottom {
    padding-left: 3em;
    padding-right: 3em;
  }
}
.app__meta {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.meta-block__icon {
  margin-right: 1em;
}
</style>
