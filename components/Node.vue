<template>
  <div class="node" :style="{left, top}">
    <div class="value">
      <div class="minus" v-on:click="giveWrapper">-</div>
      <span>{{integerValue}}</span>
      <div class="plus" v-on:click="takeWrapper">+</div>
    </div>
  </div>
</template>

<script>
// General
import { mapGetters, mapActions, mapState } from "vuex";
import { TweenLite } from "gsap/TweenLite";

export default {
  components: {},
  props: ["nodeId", "radius"],
  data() {
    return {
      tweenedValue: 0
    };
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
    TweenLite.to(this.$data, 0.5, { tweenedValue: this.node.value});
  },
  methods: {
    ...mapActions(["give", "take"]),
    giveWrapper() {
      this.give(this.node);
    },
    takeWrapper() {
      this.take(this.node);
    }
  },

  computed: {
    ...mapGetters({
      getNodes: "getNodes"
    }),

    node() {
      return this.getNodes[this.nodeId];
    },

    left() {
      if (!this.node) {
        return "0vw";
      }
      return `calc(${this.node.left}vw)`;
    },

    top() {
      if (!this.node) {
        return "0vh";
      }
      return `calc(${this.node.top}vh)`;
    },
    integerValue() {
      return this.tweenedValue.toFixed(0);
    }
  },
  watch: {
    node: {
      handler(newNode) {
        TweenLite.to(this.$data, 0.5, { tweenedValue: newNode.value });
      },
      deep: true
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
  overflow: visible;
  vertical-align: middle;
}
.value {
  text-align: center;
  color: $dark-blue;
  font-size: 3vw;
  margin: auto;
  margin-top: 3.2vw;
}
.minus,
.plus {
  width: 2vw;
  height: 2vw;
  border-radius: 100vw;
  position: absolute;
  cursor: pointer;
  top: calc(50% - 1vw);
  color: white;
  line-height: 122%;
  font-size: 1.5vw;
}

.mius,
.plus,
.value {
  // No highlighting
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.minus {
  background-color: $light-orange;
  left: -1vw;

  &:hover {
    background-color: $lightest-orange;
  }
}
.plus {
  background-color: $light-green;
  right: -1vw;

  &:hover {
    background-color: $lightest-green;
  }
}

.value span {
  transition: 500ms linear all;
}
</style>
