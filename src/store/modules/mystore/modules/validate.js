import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    msg: ''
  },
  mutations: {
    clearForm (state, formName) {
    }
  },
  actions: {
    clearValidateForm ({ commit }, formName) {
      commit('clearForm', formName)
    }
  }
}
