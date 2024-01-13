<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  background-color: powderblue;
}
h1 {
  color: blue;
}
p {
  color: red;
}
</style>
