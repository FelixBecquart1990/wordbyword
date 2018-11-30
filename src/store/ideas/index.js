const fb = require('../../firebaseConfig.js')

export default {
  state: {
    ideas: []
  },
  mutations: {
    SET_IDEAS(state, val) {
      state.ideas = val
    },
  },
  actions: {
    getIdeas({ commit, getters, state }) {

      fb.ideasCollection.orderBy("votesSum", "desc").onSnapshot(
        snapshot => {
          let listIdeas = [];
          snapshot.forEach(idea => {
            listIdeas.push(Object.assign({ ideaUid: idea.id }, idea.data()));
          });
          listIdeas = listIdeas.filter(function (data) {
            return data.reported.length < 3
          });
          commit('SET_IDEAS', listIdeas)
        },
        error => {
          console.log(error);
        }
      );
      //console.log(getters.userProfile.language)
      /*fb.wordsCollection
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
        );*/
    }
  },
  getters: {

  }
};
