const fb = require('../../firebaseConfig.js')

export default {
  state: {
    words:[]
  },
  mutations: {
    SET_WORDS(state, val) {
      state.words = val
    },
  },
  actions: {
    getWords({ commit, getters, state }) {
      //console.log(getters.userProfile.language)
      fb.wordsCollection
        .where("language", "==", getters.userProfile.language)
        .onSnapshot(
          snapshot => {
            let listWords = [];
            snapshot.forEach(word => {
              listWords.push(Object.assign({ wordUid: word.id }, word.data()));
            });
            //console.log(listWords)
            commit('SET_WORDS', listWords)
          },
          error => {
            console.log(error);
          }
        );
    }
  },
  getters: {

  }
};
