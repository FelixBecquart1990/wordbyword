const fb = require('../../firebaseConfig.js')

export default {
  state: {
    words: [],
    loader: false
  },
  mutations: {
    SET_WORDS(state, val) {
      state.words = val
    },
    SET_LOADER(state, val) {
      state.loader = val
    },
  },
  actions: {
    getWords({ commit, getters, state }) {
      commit('SET_LOADER', true)
      if (localStorage.listWords) {
        commit('SET_WORDS', JSON.parse(localStorage.getItem("listWords")))
      }
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
            listWords.sort(function (a, b) { return Object.keys(b.learners).length - Object.keys(a.learners).length });

            listWords = listWords.filter(function (data) {
              return data.reported.length < 3
            });
            let newWords = listWords.filter(function (data) {
              return data.createdOn.seconds * 1000 > new Date().getTime() - 1000 * 60 * 60 * 24;
            });
            let oldWords = listWords.filter(function (data) {
              return data.createdOn.seconds * 1000 < new Date().getTime() - 1000 * 60 * 60 * 24
            });
            listWords = newWords.concat(oldWords)

            commit('SET_WORDS', listWords)
            commit('SET_LOADER', false)
            localStorage.setItem("listWords", JSON.stringify(listWords));
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
