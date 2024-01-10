<template>
  <div id="app">
    <router-view></router-view>
    <!-- This will render the component based on the route -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

// You no longer need to import these components here, as the router will handle their rendering
@Options({
  components: {
    // Your components are now handled by the router
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
/* Your existing styles */
</style>
