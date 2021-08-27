<template>
  <div class="flex items-center">
    <svg class="mr-4" :width="iconWidth" :height="iconHeight">
      <use :xlink:href="iconId"></use>
    </svg>
    <span>{{ value }}</span><span>{{ unit }}</span>
  </div>
</template>

<script>
export default {
  name: 'TheFeature',
  props: ['iconId','iconWidth', 'iconHeight', 'value', 'unit'],
}
</script>
