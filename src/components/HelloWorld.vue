<template>
  <div>
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a class="text-teal-500" href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3 class="mt-10">Installed CLI Plugins</h3>
    <ul>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3 class="mt-10">Essential Links</h3>
    <ul>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3 class="mt-10">Ecosystem</h3>
    <ul>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li class="inline-block mx-2"><a class="text-teal-500" href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
