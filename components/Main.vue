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
    <h2 class="moves-left">Moves Left: {{movesLeft}}</h2>
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
    return {};
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
  },
  methods: {
    reload() {
      location.reload(true);
    }
  },
  computed: {
    ...mapGetters({
      movesLeft: "getActionsLeft",
      movesTaken: "getActionsTaken",
      showLoss: "showLoss",
      showWin: "showWin"
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
  color: $medium-gray;

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
  margin-top: 82vh;
  margin-left: 1vw;
  color: $orange;
}
.full-message {
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.88);
  z-index: 12;
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
</style>
