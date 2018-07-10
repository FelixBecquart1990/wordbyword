export default {
  state: {
    activated: false,
    text: ""
  },
  mutations: {
    SET_SNACKBAR(state, payload) {
      state.activated= true
      state.text= payload
    }
  }
};
