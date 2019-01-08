<template>
  <div id="main">
    <div class="full-message no-highlighting" v-if="showLoss">
      <h1>You're out of moves and not all the nodes are positive!</h1>
      <button class="message-action" @click="reload">Try again?</button>
    </div>
    <div class="full-message no-highlighting" v-else-if="showWin">
      <h1>Great job, you got all nodes to be positive!!!</h1>
      <button class="message-action" @click="reload">Play again?</button>
    </div>
    <Stage></Stage>
    <div id="below-stage">
      <div id="left-half">
        <h2 class="objective">Make every node positive!</h2>
        <h2 class="moves-left">
          Moves Left:
          <span>{{movesLeft}}</span>
        </h2>
      </div>
      <div id="right-half">
        <h2 class="objective">Select level:</h2>
        <button
          v-for="level of levelOptions"
          :key="level"
          :class="{level: true, chosen: getLevel === level.level}"
          :data-level="level.level"
          @click="changeLevelWrapper"
        >{{level.name}}</button>
      </div>
    </div>

    <div class="footer">
      <p>
        Copyright &copy; 2019
        <a href="https://github.com/ilyauts/">This Guy Studios</a>
      </p>
    </div>
  </div>
</template>

<script>
// General
import { mapGetters, mapActions, mapState } from "vuex";

// Components
import Stage from "./Stage.vue";

export default {
  components: {
    Stage
  },
  data() {
    return {
      levelOptions: [
        {
          level: "easy",
          name: "Easy",
          numNodes: 4
        },
        {
          level: "medium",
          name: "Medium",
          numNodes: 6
        },
        {
          level: "hard",
          name: "Hard",
          numNodes: 10
        }
      ]
    };
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {},
  methods: {
    ...mapActions(["changeLevel"]),
    changeLevelWrapper(e) {
      this.changeLevel({
        level: e.target.dataset.level,
        numNodes: this.levelOptions.find(
          opt => opt.level === e.target.dataset.level
        ).numNodes
      });
    },
    reload() {
      location.reload(true);
    }
  },
  computed: {
    ...mapGetters({
      movesLeft: "getActionsLeft",
      movesTaken: "getActionsTaken",
      showLoss: "showLoss",
      showWin: "showWin",
      getLevel: "getLevel"
    })
  }
};
</script>

<style lang="scss">
// Import colors and such
@import "../scss/variables";

// Font importation
html,
body,
div,
h1,
h2,
h3,
h4,
h5,
h6,
span,
li,
ol,
ul {
  font-family: "Varela Round", sans-serif;
}

#main {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  position: absolute;
  background-color: $darkest-blue;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}
.footer {
  position: fixed;
  bottom: 0vh;
  font-size: 0.75em;
  width: 100%;
  text-align: right;
  color: $medium-gray;
  margin-top: auto;

  // No highlighting
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
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
.moves-left {
  margin-left: 1vw;
  color: $orange;

  & span {
    text-decoration: underline;
  }
}
.objective {
  margin-left: 1vw;
  color: $darkest-orange;
}
.full-message {
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.88);
  z-index: 20;
}
.full-message h1 {
  color: $green;
  margin: 30vh auto 0vh auto;
  text-align: center;
}
.message-action {
  width: 30vw;
  height: 15vh;
  font-size: 3vw;
  background-color: $green;
  color: $light-orange;
  font-weight: bold;
  outline: none;
  border: none;
  margin-left: 35vw;
  margin-top: 5vh;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: $dark-green;
  }
}
.no-highlighting {
  // No highlighting
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
#left-half,
#right-half {
  width: 50vw;
  display: inline-block;
  float: left;
}
.level {
  width: 10vw;
  height: 5vh;
  font-size: 1vw;
  background-color: $light-blue;
  color: $light-orange;
  font-weight: bold;
  outline: none;
  border: none;
  margin-top: 1vh;
  cursor: pointer;
  z-index: 22;

  &.chosen {
    background-color: $green;
  }
}
#right-half .objective {
  margin-left: 0;
}
#below-stage {
  margin-top: 82vh;
  width: 100%;
  height: 18vh;
}
</style>
