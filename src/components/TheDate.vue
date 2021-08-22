<template>
  <div style="min-width: 4rem;" class="font-opensans text-white bg-blue-500 font-bold uppercase ml-auto flex flex-col items-center justify-center h-16 p-2">
    <span class="text-sm">{{ month }}</span>
    <span class="text-lg">{{ day }}</span>
  </div>
</template>

<script>
export default {
  name: 'TheDate',
  props: ['month', 'day']
}
</script>
