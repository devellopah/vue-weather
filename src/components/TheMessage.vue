<template>
  <transition name="fade">
    <div v-if="!isFaded" :class="[isRevealed ? 'block' : 'hidden' ,'absolute bg-white w-full top-0 text-center text-grey-900 py-1']">
      The recent successful result is shown
    </div>
  </transition>
</template>

// todo: reveal message on modal dialog close

<script>
export default {
  name: 'TheMessage',
  props: ['isRevealed'],
  data() {
    return {
      isFaded: false,
      timer: null
    }
  },
  watch: {
    isRevealed(val) {
      if (val) {
        this.timer = setTimeout(() => {
          this.isFaded = true
        }, 6000)
      }
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
