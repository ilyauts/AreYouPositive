<template>
  <div id="main">
    <Stage></Stage>
  </div>
</template>

<script>
import Stage from "./Stage.vue";

export default {
  components: {
    Stage
  },
  data() {
    return {};
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
  },
  methods: {}
};
</script>

<style lang="scss">
// Import colors and such
@import "../scss/variables";
#main {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: absolute;
  background-color: $darkest-blue;
  left: 0;
  top: 0;
}
</style>
