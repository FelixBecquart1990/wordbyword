export default {
  state: {
    loading:false,
    addToHomeScreen: null
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading= payload
    },
    SET_ADD_TO_HOME_SCREEN(state, payload) {
      state.addToHomeScreen = payload;
    }
  },
  getters:{
    addToHomeScreen(state) {
      return state.addToHomeScreen;
    }
  }
};
