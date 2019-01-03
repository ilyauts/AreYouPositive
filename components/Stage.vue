<template>
  <div id="stage">
    <Node
      v-for="nodeLocation in nodeLocations"
      :key="nodeLocation"
      :location="nodeLocation"
      :radius="nodeRadius"
    ></Node>
  </div>
</template>

<script>
import Node from "./Node.vue";

export default {
  components: {
    Node
  },
  data() {
    return {
      nodeRadius: 5,
      numNodes: 5,
      nodeLocations: []
    };
  },
  beforeMount() {
    this.generateNodes.call(this);
  },
  beforeDestroy() {},
  mounted() {
  },
  methods: {
    generateNodes() {
      let attempts = 0;

      do {
        let obj = {
          top: this.generateNum(),
          left: this.generateNum(),
          value: this.generateInt(10)
        };

        if (this.farEnoughAway(obj)) {
          this.nodeLocations.push(obj);
        }
      } while (this.nodeLocations.length < this.numNodes || attempts++ < 100);
    },
    farEnoughAway(potential) {
      // Should be fully on the screen
      if (
        potential.top < 0 ||
        potential.top > 45 ||
        potential.left < 0 ||
        potential.left > 90
      ) {
        return false;
      }

      // Otherwise must not overlap with any other nodes
      for (let location of this.nodeLocations) {
        if (
          Math.sqrt(
            Math.pow(potential.top - location.top, 2) +
              Math.pow(potential.left - location.left, 2)
          ) <
          this.nodeRadius * 6
        ) {
          return false;
        }
      }

      return true;
    },
    generateNum(max) {
      max = max ? max : 100;

      return Math.floor(Math.random() * max * 100) / 100;
    },
    generateInt(max) {
      max = max ? max : 100;

      return Math.floor(Math.random() * max);
    }
  }
};
</script>

<style lang="scss">
// Import colors and such
@import "../scss/variables";
#stage {
  height: 80vh;
  width: 100vw;
  overflow: hidden;
  position: absolute;
  background-color: $dark-blue;
  left: 0;
  top: 0;
}
</style>
