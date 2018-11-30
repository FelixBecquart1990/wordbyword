const fb = require('../../firebaseConfig.js')

export default {
  state: {
    words: [],
    loader: false,
    lastVisible: null,
    isGettingNextWords: false
  },
  mutations: {
    SET_WORDS(state, val) {
      state.words = val
    },
    SET_LOADER(state, val) {
      state.loader = val
    },
    SET_LAST_VISIBLE(state, val) {
      state.lastVisible = val
    },
    SET_IS_GETTING_NEXT_WORDS(state, val) {
      state.isGettingNextWords = val
    },
  },
  actions: {
    getNextWords({ commit, getters, state }) {
      commit('SET_IS_GETTING_NEXT_WORDS', true)
      let listWords = [];

      var next = fb.wordsCollection
        .orderBy("createdOn", "desc")
        .where("language", "==", getters.userProfile.language)
        .startAfter(state.lastVisible)
        .limit(25);

      next.get().then(function (documentSnapshots) {
        // Get the last visible document
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // console.log("last", lastVisible);
        commit('SET_LAST_VISIBLE', lastVisible)

        documentSnapshots.forEach((word) => {
          // console.log(`${word.id} => ${word.data()}`);
          listWords.push(Object.assign({ wordUid: word.id }, word.data()));
        });
        // console.log(listWords)
        commit('SET_WORDS', state.words.concat(listWords))
        commit('SET_IS_GETTING_NEXT_WORDS', false)

      })
    },
    getWords({ commit, getters, state }) {
      commit('SET_LOADER', true)
      if (localStorage.listWords) {
        commit('SET_WORDS', JSON.parse(localStorage.getItem("listWords")))
      }
      let listWords = [];

      var first = fb.wordsCollection
        .orderBy("createdOn", "desc")
        .where("language", "==", getters.userProfile.language)
        .limit(25)

      first.get().then(function (documentSnapshots) {
        // Get the last visible document
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // console.log("last", lastVisible);
        commit('SET_LAST_VISIBLE', lastVisible)

        documentSnapshots.forEach((word) => {
          // console.log(`${word.id} => ${word.data()}`);
          listWords.push(Object.assign({ wordUid: word.id }, word.data()));
        });
        // console.log(listWords)
        commit('SET_LOADER', false)
        commit('SET_WORDS', listWords)
        localStorage.setItem("listWords", JSON.stringify(listWords));
      })


      // fb.wordsCollection
      //   .orderBy("createdOn", "desc")
      //   .where("language", "==", getters.userProfile.language)
      //   .limit(limit)
      //   .onSnapshot(
      //     snapshot => {
      //       let listWords = [];
      //       snapshot.forEach(word => {
      //         listWords.push(Object.assign({ wordUid: word.id }, word.data()));
      //       });
      //       //console.log(listWords)
      //       //listWords.sort(function (a, b) { return Object.keys(b.learners).length - Object.keys(a.learners).length });

      //       listWords = listWords.filter(function (data) {
      //         return data.reported.length < 3
      //       });
      //       // let newWords = listWords.filter(function (data) {
      //       //   return data.createdOn.seconds * 1000 > new Date().getTime() - 1000 * 60 * 60 * 24;
      //       // });
      //       // let oldWords = listWords.filter(function (data) {
      //       //   return data.createdOn.seconds * 1000 < new Date().getTime() - 1000 * 60 * 60 * 24
      //       // });
      //       // listWords = newWords.concat(oldWords)
      //       // listWords.sort(function (a, b) { return Object.keys(b.learners).length - Object.keys(a.learners).length });

      //       // listWords.sort(function(a,b) {return (a.createdOn < b.createdOn) ? 1 : ((b.createdOn < a.createdOn) ? -1 : 0);} )

      //       commit('SET_WORDS', listWords)
      //       commit('SET_LOADER', false)
      //       localStorage.setItem("listWords", JSON.stringify(listWords));
      //     },
      //     error => {
      //       console.log(error);
      //     }
      //   );
    }
  },
  getters: {

  }
};
