<template>
  <div id="main">
    <Stage></Stage>
    <div class="footer">
      <p>
        Copyright &copy; 2019
        <a href="https://github.com/ilyauts/">This Guy Studios</a>
      </p>
    </div>
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
  mounted() {},
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
.footer {
  position: fixed;
  bottom: 0vh;
  font-size: 0.75em;
  width: 100%;
  text-align: right;
  color: $dark-gray;
}
.footer p {
  margin-right: 1vw;
  margin-bottom: 1vh;
}
.footer p a {
  color: $orange;
  text-decoration: none;
}
.footer p a:hover {
  color: $light-orange;
  text-decoration: none;
}
</style>
