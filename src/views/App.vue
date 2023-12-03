<template>
  <div id="app">
    <Clothes />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
//import HelloWorld from "../components/HelloWorld.vue";
import Clothes from "../components/Clothes.vue";

@Options({
  components: {
    // HelloWorld
    Clothes,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
