<template>
  <div class="font-semibold text-gray-700 text-lg font-sspro">
    {{`${name}, ${country}`}}
  </div>
</template>

<script>
export default {
  name: 'TheLocation',
  props: ['name', 'country']
}
</script>
