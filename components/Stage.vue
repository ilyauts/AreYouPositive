<template>
  <div id="stage">
    <Node
      v-for="nodeLocation in nodeLocations"
      :key="nodeLocation"
      :nodeId="nodeLocation.nodeId"
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
        class="connection"
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
      connections: [],

      // Compare width to height of the screen
      scale: 1
    };
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
    let main = document.getElementById("main");
    // Determine x where xvh = 1vw
    console.log(main, main.clientWidth, main.clientHeight);
    this.scale = main.clientWidth / main.clientHeight;

    this.generateNodes.call(this);
  },
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

      // Remove any lines that intersect
      this.removeIntersections();

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

          // Ensure that this is the first time we're making this connection
          if (!connectionsMade.includes(arr.join("-"))) {

            let scaleRadius = this.nodeRadius * this.scale;
            connectionsMade.push({
              x1: a.left + this.nodeRadius + "vw",
              x2: b.left + this.nodeRadius + "vw",
              y1: a.top + scaleRadius + "vh",
              y2: b.top + scaleRadius + "vh"
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
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&";
      let nodeId = "";
      for (var i = 0; i < length; ++i) {
        nodeId += domain[this.generateInt(domain.length)];
      }

      return nodeId;
    },
    removeIntersections() {
      let toDelete = [];
      for (let objI1 = 0; objI1 < this.connections.length; ++objI1) {
        // Reference to object1
        let obj1 = this.connections[objI1];

        for (let objI2 = objI1 + 1; objI2 < this.connections.length; ++objI2) {
          // Reference to object2
          let obj2 = this.connections[objI2];

          // Delete if intersection occurs and neither are set for deleting down the road
          if (
            this.doesItIntersect(obj1, obj2) &&
            !(toDelete.includes(objI1) || toDelete.includes(objI2))
          ) {
            // Delete the second object
            toDelete.push(objI2);
          }
        }
      }

console.log('todelete', toDelete);
      // Loop through the array and delete any old connections
      for (let i = (this.connections.length - 1); i >= 0; --i) {
        if (toDelete.includes(i)) {
          this.connections.splice(i, 1);
        }
      }
    },
    doesItIntersect(obj1, obj2) {
      console.log(
        obj1,
        obj2,
        parseFloat(obj1.y1),
        parseFloat(obj1.y2),
        parseFloat(obj1.x1),
        parseFloat(obj1.x2)
      );
      // Slopes
      let slope1 =
          (parseFloat(obj1.y2) - parseFloat(obj1.y1)) /
          (parseFloat(obj1.x2) - parseFloat(obj1.x1)),
        slope2 =
          (parseFloat(obj2.y2) - parseFloat(obj2.y1)) /
          (parseFloat(obj2.x2) - parseFloat(obj2.x1));

      let c1 = slope1 * parseFloat(obj1.x1) - parseFloat(obj2.y1),
        c2 = slope2 * parseFloat(obj2.x1) - parseFloat(obj2.y1);

      let slopeDiff = slope1 - slope2;

      // If same line, remove it
      if (slopeDiff == 0 && c2 - c1 == 0) {
        console.log("same line", obj1, obj2);
        return true;
      }

      // Otherwise find x
      let x = (c2 - c1) / (slope1 - slope2);

      // Determine the x value
      console.log(111, slope1, slope2, c1, c2, x);

      // Ensure that the visible portions of both lines are the only things considered
      if (
        x > parseFloat(obj1.x1) &&
        x < parseFloat(obj1.x2) &&
        x > parseFloat(obj2.x1) &&
        x < parseFloat(obj2.x2)
      ) {
        return true;
      }

      return false;
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
.connection {
  stroke:$lightest-blue;
  stroke-width:5;
  cursor: pointer;

  &:hover {
    stroke: $lightest-orange;
  }
}
</style>
