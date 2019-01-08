<template>
  <div id="stage">
    <Node
      v-for="nodeLocation in nodeLocations"
      :key="nodeLocation"
      :nodeId="nodeLocation.nodeId"
      :radius="nodeRadius"
    ></Node>
    <svg
      height="80vh"
      width="100vw"
      id="svg-lines"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <line
        v-for="connection in connections"
        :key="connection"
        :x1="connection.x1"
        :x2="connection.x2"
        :y1="connection.y1"
        :y2="connection.y2"
        class="connection"
        :data-lineNum="parseFloat(connection.x2)-parseFloat(connection.x1)"
        :data-x1="parseFloat(connection.x1)"
        :data-x2="parseFloat(connection.x2)"
        :data-y1="parseFloat(connection.y1)"
        :data-y2="parseFloat(connection.y2)"
        v-on:click="printLineNum"
      ></line>
    </svg>
    <img
      v-for="(money, index) in moneys"
      :key="money"
      class="money"
      :id="'moneys-'+ index"
      :style="{ top: money.currTop + 'vh', left: money.currLeft + 'vw'}"
      src="money-wallet.svg"
      alt="Money"
    >
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
      nodeLocations: [],
      connections: [],
      moneys: [],

      // Compare width to height of the screen
      scale: 1,

      // Ensure that everything's been set up
      setUp: false
    };
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
    this.startFromTheTop();
  },
  methods: {
    ...mapActions([
      "addNode",
      "give",
      "take",
      "numActionsTaken",
      "showLoss",
      "showWin",
      "nukeNodes"
    ]),
    startFromTheTop() {
      let main = document.getElementById("main");

      // Determine x where xvh = 1vw
      this.scale = main.clientWidth / main.clientHeight;

      // Repeat while loners exist or we've tried for long enough
      let generationCount = 0;
      do {
        this.generateNodes.call(this);

        generationCount++;
      } while (!this.noLoners() && generationCount < 100);

      // Randomize node values
      this.randomizeValues();

      // Redraw svg on window resize
      window.addEventListener("resize", () => {
        this.scale = main.clientWidth / main.clientHeight;
        this.createConnections();
      });
    },
    printLineNum(e) {
      let slope =
        (e.target.dataset.y1 - e.target.dataset.y2) /
        (e.target.dataset.x1 - e.target.dataset.x2);

      console.log(
        `POINT X => (${e.target.dataset.x1}, ${e.target.dataset.y1}), Y=> (${
          e.target.dataset.x2
        }, ${e.target.dataset.y2}) NAME => ${
          e.target.dataset.lineNum
        } y= ${slope}x + ${e.target.dataset.y1 - slope * e.target.dataset.x1}`
      );
    },
    randomizeValues() {
      // Loop through all nodes and randomly act
      do {
        let numActions = this.generateInt(1000) + 5; // At least 5 actions at all times

        for (let i = 0; i < numActions; ++i) {
          if (this.generateInt(2)) {
            this.give(
              this.nodeLocations[this.generateInt(this.nodeLocations.length)]
            );
          } else {
            this.take(
              this.nodeLocations[this.generateInt(this.nodeLocations.length)]
            );
          }
        }

        // Store the number of actions taken
        this.numActionsTaken(numActions);
      } while (this.allPositive());
    },
    allPositive() {
      // Ensure that at least one node is negative
      for (let node of this.nodeLocations) {
        if (node.value <= 0) {
          return false;
        }
      }
      return true;
    },
    // Ensure that all nodes are connected
    noLoners() {
      let nodesTraversed = [];
      this.recursiveNodeSearch(this.nodeLocations[0].nodeId, nodesTraversed);

      return nodesTraversed.length === this.nodeLocations.length;
    },
    recursiveNodeSearch(nodeId, foundArr) {
      // If we've already seen this node return
      if (foundArr.includes(nodeId)) {
        return foundArr;
      }

      // Note that this node has been traversed
      foundArr.push(nodeId);

      let currNode = this.nodeLocations.find(node => node.nodeId === nodeId);
      for (let connection of currNode.connections) {
        foundArr = this.recursiveNodeSearch(connection, foundArr);
      }

      return foundArr;
    },
    generateNodes() {
      // Start by nuking the nodes in store
      this.nukeNodes();

      let attempts = 0,
        nodeArray = [];

      do {
        let obj = {
          top: this.generateNum(46),
          left: this.generateNum(89) + 1,
          value: this.generateInt(10) + 1,
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
        let numConnections = this.generateInt(nodeArray.length - 1) + 1;

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
      this.createConnections();

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
          if (
            !connectionsMade.find(
              cEl => cEl.nodeId1 === arr[0] && cEl.nodeId2 === arr[1]
            )
          ) {
            let scaleRadius = this.nodeRadius * this.scale;
            connectionsMade.push({
              x1: a.left + this.nodeRadius + "vw",
              x2: b.left + this.nodeRadius + "vw",
              y1: a.top + scaleRadius + "vh",
              y2: b.top + scaleRadius + "vh",
              nodeId1: a.nodeId,
              nodeId2: b.nodeId
            });
          }
        }
      }

      // Update state
      this.connections = connectionsMade;
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

        // Ignore anything set for deletion
        if (toDelete.includes(objI1)) {
          continue;
        }

        for (let objI2 = objI1 + 1; objI2 < this.connections.length; ++objI2) {
          // Ignore anything set for deletion
          if (toDelete.includes(objI2)) {
            continue;
          }

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

      // Sort delete array
      toDelete.sort((a, b) => a - b);

      // Loop through the array and delete any old connections
      for (let i = this.connections.length - 1; i >= 0; --i) {
        // Only delete those connections that are slated for deletion
        let currConnection = this.connections[i];

        if (toDelete.includes(i)) {
          // Remove residual references
          let node1 = this.nodeLocations.find(
            node => node.nodeId === currConnection.nodeId1
          );
          let node2 = this.nodeLocations.find(
            node => node.nodeId === currConnection.nodeId2
          );

          // Determine if linkage still exists
          let indexOfConnection1 = node1.connections.indexOf(
            currConnection.nodeId2
          );

          // If so, unlink it
          if (indexOfConnection1 >= 0) {
            node1.connections.splice(indexOfConnection1, 1);
          }

          // Determine if linkage still exists in reverse
          let indexOfConnection2 = node2.connections.indexOf(
            currConnection.nodeId1
          );

          // If so, unlink it
          if (indexOfConnection2 >= 0) {
            node2.connections.splice(indexOfConnection2, 1);
          }

          this.connections.splice(i, 1);
        }
      }
    },
    doesItIntersect(obj1, obj2) {
      let ob1x1 = parseFloat(obj1.x1),
        ob1x2 = parseFloat(obj1.x2),
        ob2x1 = parseFloat(obj2.x1),
        ob2x2 = parseFloat(obj2.x2),
        // Map y scale to x scale
        ob1y1 = parseFloat(obj1.y1) / this.scale,
        ob1y2 = parseFloat(obj1.y2) / this.scale,
        ob2y1 = parseFloat(obj2.y1) / this.scale,
        ob2y2 = parseFloat(obj2.y2) / this.scale;

      // Slopes
      let slope1 = (ob1y2 - ob1y1) / (ob1x2 - ob1x1),
        slope2 = (ob2y2 - ob2y1) / (ob2x2 - ob2x1);

      let c1 = ob1y1 - slope1 * ob1x1,
        c2 = ob2y1 - slope2 * ob2x1;

      let slopeDiff = slope1 - slope2;

      // If same line, remove it
      if (slopeDiff == 0 && c2 - c1 == 0) {
        return true;
      }

      // Otherwise find x
      let x = (c2 - c1) / (slope1 - slope2);

      // Ensure that the visible portions of both lines are the only things considered
      if (
        x > this.smallest(ob1x1, ob1x2) &&
        x < this.largest(ob1x1, ob1x2) &&
        x > this.smallest(ob2x1, ob2x2) &&
        x < this.largest(ob2x1, ob2x2)
      ) {
        return true;
      }

      // Now determine if any nodes are intersected by the lines
      for (let node of this.nodeLocations) {
        // Ignore if one of the two connecting nodes
        if (node.nodeId !== obj2.nodeId1 && node.nodeId !== obj2.nodeId2) {
          // Start by determining the shortest distance to the center of the node
          let xCenter = node.left + this.nodeRadius,
            yCenter = node.top / this.scale + this.nodeRadius;

          let distanceToCenter =
            Math.abs(slope2 * xCenter + -1 * yCenter + c2) /
            Math.sqrt(Math.pow(slope2, 2) + Math.pow(-1, 2));

          // If the shortest distance lies within the circle, then remove the line
          // 1.5 is a fudge factor
          if (distanceToCenter <= this.nodeRadius * 1.5) {
            return true;
          }
        }
      }

      return false;
    },
    animateMoney() {
      if (this.lastAction !== "give" && this.lastAction !== "take") {
        return;
      }

      // Nuke any old moneys
      this.moneys = [];

      let node = this.nodeLocations.find(
        nodeElement => nodeElement.nodeId === this.lastActionNode
      );

      for (let endNodeId of node.connections) {
        let endNode = this.nodeLocations.find(
          nodeElement => nodeElement.nodeId === endNodeId
        );

        let startingAtParent = this.lastAction === "give";

        // Determine from where and to where
        let deltaRadius = this.nodeRadius - 1.5; // radius minus 1/2 radius of money

        let startingLeft = startingAtParent
            ? node.left + deltaRadius
            : endNode.left + deltaRadius,
          endingLeft = startingAtParent
            ? endNode.left + deltaRadius
            : node.left + deltaRadius,
          startingTop = startingAtParent
            ? node.top + deltaRadius * this.scale
            : endNode.top + deltaRadius * this.scale,
          endingTop = startingAtParent
            ? endNode.top + deltaRadius * this.scale
            : node.top + deltaRadius * this.scale;

        // Add to moneys
        this.moneys.push({
          startingLeft,
          endingLeft,
          startingTop,
          endingTop,
          currLeft: startingLeft,
          currTop: startingTop
        });
      }

      // Wait a bit and then change the top and left
      setTimeout(() => {
        // Now loop through all of the moneys and change the positions
        for (let money of this.moneys) {
          money.currLeft = money.endingLeft;
          money.currTop = money.endingTop;
        }
      }, 25);
    },
    smallest(a, b) {
      return a > b ? b : a;
    },
    largest(a, b) {
      return a > b ? a : b;
    }
  },
  computed: {
    ...mapGetters({
      getNodes: "getNodes",
      movesLeft: "getActionsLeft",
      lastAction: "lastAction",
      lastActionNode: "lastActionNode",
      getLevel: "getLevel",
      numNodes: "numNodes"
    })
  },
  watch: {
    movesLeft: {
      handler(newNum) {
        if (!this.setUp) {
          this.setUp = true;
          return;
        }

        // Check if you won
        if (this.allPositive()) {
          this.showWin();
        }

        // Did you lose?
        else if (newNum === 0) {
          this.showLoss();
        }

        // Handle animation
        this.animateMoney();
      }
    },
    getLevel: {
      handler(newLevel) {
        this.setUp = false;
        this.startFromTheTop();
      }
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
  stroke: $lightest-blue;
  stroke-width: 5;
  cursor: pointer;

  &:hover {
    stroke: $lightest-orange;
  }
}
.money {
  transition: 0.5s all linear;
  z-index: 11;
  position: absolute;
  width: 3vw;
}
</style>
