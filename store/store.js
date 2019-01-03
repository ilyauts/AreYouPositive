

import Vue from 'vue';
import Vuex from 'vuex';

import general from './general';

Vue.use(Vuex);

Vue.config.devtools = true;

export default new Vuex.Store({
  modules: {
    general
  }
});
