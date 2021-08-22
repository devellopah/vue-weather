<template>
  <svg class="w-64 h-64 mx-auto">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
export default {
  name: 'TheIcon',
  props: ['icon'],
}
</script>
