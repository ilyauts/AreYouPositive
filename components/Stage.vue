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
// General
import { mapGetters, mapActions, mapState } from "vuex";

// Components
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
  mounted() {},
  methods: {
    ...mapActions(["addNode"]),
    generateNodes() {
      let attempts = 0;

      do {
        let obj = {
          top: this.generateNum(),
          left: this.generateNum(),
          value: this.generateInt(10),
          nodeId: this.generateNodeId(),
          connections: []
        };

        if (this.farEnoughAway(obj)) {
          // Create node visually
          this.nodeLocations.push(obj);

          // Create state for node
          this.addNode(obj);
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
    },
    generateNodeId(length) {
        length = (length) ? length: 10;

        const domain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let nodeId = '';
        for(var i = 0; i < length; ++i) {
            nodeId += domain[this.generateInt(domain.length)];
        }

        return nodeId;
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
