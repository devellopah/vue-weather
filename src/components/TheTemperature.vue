<template>
  <div class="temperature font-montserrat text-6xl inline-block relative leading-tight font-light text-gray-600 pl-5 pr-3">{{ value }}</div>
</template>

<script>
export default {
  name: 'TheTemperature',
  props: ['value']
}
</script>
