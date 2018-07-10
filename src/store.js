import Vue from 'vue'
import Vuex from 'vuex'
import snackbar from './store/snackbar'
import user from './store/user'
import words from './store/words'
import utilities from './store/utilities'

const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// banner
window.addEventListener("beforeinstallprompt", function(event) {
  event.preventDefault();
  store.commit("SET_ADD_TO_HOME_SCREEN", event);
  return false
});

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('SET_CURRENT_USER', user)
    store.dispatch('fetchUserProfile')

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('SET_USER_PROFILE', doc.data())
    })

    // improvement TO DO
    // fb.ideasCollection.orderBy('createdOn').onSnapshot(snapshot => {
    //   let listIdeas = []
    //   snapshot.docChanges().forEach(change => {
    //     let doc = change.doc
    //     if (change.type == 'added') {
    //       listIdeas.push(Object.assign({ ideaUid: doc.id }, doc.data()))
    //     }
    //   })
    //   store.commit('SET_IDEAS', listIdeas)
    // }, function (error) {
    //   console.log(error)
    // })

  }
})

export const store = new Vuex.Store({
  modules: {
    snackbar,
    user,
    words,
    utilities
  }
})
