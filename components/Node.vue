<template>
  <div class="node" :style="{left, top}"></div>
</template>

<script>

export default {
  components: {
  },
  props: ['location', 'radius'],
  data() {
    return {};
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
  },
  methods: {
  },
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
  box-shadow: 0 0 5px 0px rgba(0,0,0,.7);
  background-color: $orange;
  position: absolute;
}
</style>
