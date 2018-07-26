const fb = require('../../firebaseConfig.js')

export default {
  state: {
    currentUser: null,
    userProfile: {}
  },
  mutations: {
    SET_CURRENT_USER(state, val) {
      state.currentUser = val
    },
    SET_USER_PROFILE(state, val) {
      state.userProfile = val
    },
    SET_LANGUAGE(state, payload) {
      state.userProfile.language = payload
    },
    SET_NOTIFICATIONS_FREQUENCY(state, payload) {
      state.userProfile.notificationsFrequency = payload
    }
  },
  actions: {
    fetchUserProfile({ commit, state, dispatch }) {
      if (localStorage.userProfile) {
        commit('SET_USER_PROFILE', JSON.parse(localStorage.getItem("userProfile")))
      }
      fb.usersCollection.doc(state.currentUser.uid).get().then(user => {
        commit('SET_USER_PROFILE', user.data())
        dispatch("getWords");
        dispatch("getIdeas");
        localStorage.setItem("userProfile", JSON.stringify(user.data()));
      }).catch(err => {
        console.log(err)
      })
    },
    clearData({ commit }) {
      commit('SET_CURRENT_USER', null)
      commit('SET_USER_PROFILE', {})
    },
  },
  getters: {
    userProfile(state) {
      return state.userProfile;
    }
  }
};
