<template>
  <div id="stage">
    <Node
      v-for="nodeLocation in nodeLocations"
      :key="nodeLocation"
      :location="nodeLocation"
      :radius="nodeRadius"
    ></Node>
    <svg height="100vh" width="100vw">
      <line
        v-for="connection in connections"
        :key="connection"
        :x1="connection.x1"
        :x2="connection.x2"
        :y1="connection.y1"
        :y2="connection.y2"
        style="stroke:#515aad;stroke-width:5"
      ></line>
    </svg>
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
      nodeLocations: [],
      connections: []
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
      let attempts = 0,
        nodeArray = [];

      do {
        // console.log(1111);
        let obj = {
          top: this.generateNum(46),
          left: this.generateNum(91),
          value: this.generateInt(10),
          nodeId: this.generateNodeId(),
          connections: []
        };

        if (this.farEnoughAway(obj, nodeArray)) {
          nodeArray.push(obj);
        }
      } while (nodeArray.length < this.numNodes && attempts++ < 500);

      // Determine the connections
      for (let objIndex in nodeArray) {
        // Always have at least one connection
        let numConnections = this.generateInt(nodeArray.length - 2) + 1;

        // Allowable connections
        let allowableConnections = Array.from(
          new Array(nodeArray.length),
          (item, index) => index
        );

        // Remove itself from the connections
        allowableConnections.splice(objIndex, 1);

        // Now keep picking connections from the lot
        for (let i = 0; i < numConnections; ++i) {
          let currConnectionIndex = this.generateInt(
              allowableConnections.length
            ),
            currConnection = allowableConnections[currConnectionIndex];

          // Amend node to include connection index
          if (
            !nodeArray[objIndex].connections.includes(
              nodeArray[currConnection].nodeId
            )
          ) {
            nodeArray[objIndex].connections.push(
              nodeArray[currConnection].nodeId
            );
          }

          // Connections are two ways, so do the same for the node that you're connected to
          if (
            !nodeArray[currConnection].connections.includes(
              nodeArray[objIndex].nodeId
            )
          ) {
            nodeArray[currConnection].connections.push(
              nodeArray[objIndex].nodeId
            );
          }
        }
      }

      // Create nodes visually
      this.nodeLocations = nodeArray;

      // Create connections visually
      this.createConnections(nodeArray);

      // Create state for nodes
      for (let obj of nodeArray) {
        this.addNode(obj);
      }
    },
    farEnoughAway(potential, nodeArray) {
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
      for (let location of nodeArray) {
        if (
          Math.sqrt(
            Math.pow(potential.top - location.top, 2) +
              Math.pow(potential.left - location.left, 2)
          ) <
          this.nodeRadius * 5
        ) {
          return false;
        }
      }

      return true;
    },
    createConnections() {
      let connectionsMade = [];
      for (let node of this.nodeLocations) {
        for (let cnct of node.connections) {
          let arr = [node.nodeId, cnct].sort();

          let a, b;

          if (arr[0] === node.nodeId) {
            a = node;
            b = this.nodeLocations.find(element => element.nodeId === cnct);
          } else {
            a = this.nodeLocations.find(element => element.nodeId === cnct);
            b = node;
          }

          console.log("a", a, "b", b);

          // Ensure that this is the first time we're making this connection
          if (!connectionsMade.includes(arr.join("-"))) {
            connectionsMade.push({
              x1: a.left + this.nodeRadius + "vw",
              x2: b.left + this.nodeRadius + "vw",
              y1: `calc(${a.top}vh + ${this.nodeRadius}vw)`,
              y2: `calc(${b.top}vh + ${this.nodeRadius}vw)`
            });
          }
        }
      }

      // Update state
      this.connections = connectionsMade;
    },
    drawConnections() {},
    generateNum(max) {
      max = max ? max : 100;

      return Math.floor(Math.random() * max * 100) / 100;
    },
    generateInt(max) {
      max = max ? max : 100;

      return Math.floor(Math.random() * max);
    },
    generateNodeId(length) {
      length = length ? length : 10;

      const domain =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let nodeId = "";
      for (var i = 0; i < length; ++i) {
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
