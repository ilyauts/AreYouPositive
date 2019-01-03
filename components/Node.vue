<template>
  <div class="node" :style="{left, top}">
    <div class="value">{{location.value}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["location", "radius", "value"],
  data() {
    return {};
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {},
  methods: {},
  computed: {
    left() {
      return `calc(${this.location.left}vw)`;
    },

    top() {
      return `calc(${this.location.top}vh)`;
    }
  }
};
</script>

<style lang="scss">
// Import colors and such
@import "../scss/variables";
.node {
  width: 10vw;
  height: 10vw;
  border-radius: 100vw;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.7);
  background-color: $orange;
  position: absolute;
  overflow: hidden;
  vertical-align: middle;
}
.value {
  text-align: center;
  color: $dark-blue;
  font-size: 3vw;
  margin: auto;
  margin-top: 3.2vw;
}
</style>
