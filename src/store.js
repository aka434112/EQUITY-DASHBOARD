import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    UPDATE_APPLICATION_STATE (state) {
      state.loading = !state.loading
    }
  },
  actions: {

  },
  getters: {
    loading: (state) => state.loading
  }
})
