<template>
<div id="app" class="app">
  <div class="app__top">
    <svg class="app__icon">
      <use xlink:href="#day"></use>
    </svg>
    <div class="app__data">
      <div class="app__temp">13</div>
      <div class="app__box">
        <div class="app__summary">Partly Cloudy</div>
        <div class="app__location">Derbent, Dagestan</div>
      </div>
        <div class="app__date">
          <span class="app__month">May</span>
          <span class="app__day">8</span>
        </div>
      </div>
    </div>
    <div class="app__bottom">
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="30" height="19">
          <use xlink:href="#wind-speed"></use>
        </svg>
        <span>2</span><span>MPH</span>
      </div>
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="16" height="20">
          <use xlink:href="#humidity"></use>
        </svg>
        <span>80</span><span>%</span>
      </div>
      <div class="meta-block app__meta">
        <svg class="meta-block__icon" width="22" height="22">
          <use xlink:href="#cloudiness"></use>
        </svg>
        <span>39</span><span>%</span>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'App',
  data() {
    return {
      // city: null,
      // region: null,
      // loc: null,
      resetTime: null,
      city: 'Derbent',
      region: 'Dagestan',
      loc: '42.0678,48.2899'
    }
  },
  async mounted() {
    // this.getLoc()
    // await this.getWeather()
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
    async getWeather () {
      try {
        // const location = await this.getLocation()
        const url = `${process.env.VUE_APP_WEATHER_API_URL}?loc=${this.loc}&unit=m`
        const { data } = await this.axios.get(url)
        // sessionStorage.setItem('weather', JSON.stringify(currently))
        // sessionStorage.setItem(
        //   'nextReqAllowedFrom',
        //   JSON.stringify(nextReqAllowedFrom.split(',')[1].trim())
        // )

        // this.displayWeather(currently)
        console.log('data', data)
      } catch ({ response: { status, statusText, data } }) {
        // console.clear()
        if (status === 429) {
          this.resetTime = data.resetTime
          this.$swal({
            title: statusText,
            text: `Try again later in ${dayjs(this.resetTime).diff(dayjs(new Date()), 'minute')} minutes`,
            icon: 'info',
            // background: '#f8f8f8',
            // confirmButtonText: 'Ok, i got it (:'
          })

          // this.displayWeather(JSON.parse(sessionStorage.getItem('weather')))
        }
      }
    }
  }
}
</script>

<style>
/* https://tailwindcss.com/docs/installation#include-tailwind-in-your-css */
@import "tailwindcss/tailwind.css";
body {
  height: 100vh;
  background-color: #b0c4de;
  padding: 0 8px;
  margin: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
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
}
.app__top {
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
