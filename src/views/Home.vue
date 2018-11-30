<template>
  <div>
    <toolbar style="margin-bottom:64px"/>
    <v-container
      fill-height
      fluid
      style="border-bottom:solid 1px rgba(0,0,0,0.07); background-color:white; min-height:100px"
    >
      <v-layout column align-center justify-center>
        <v-flex>
          <h2 class="secondary--text" style="font-weight:normal;">Select the
            <v-tooltip bottom>
              <span slot="activator" class="primary--text">words</span>
              <span>You will receive silent notifications to help you to remember these words</span>
            </v-tooltip> you want to learn
          </h2>
        </v-flex>
      </v-layout>
    </v-container>

    <AllowNotifications/>

    <v-container v-if="words.length == 0" style="margin-top:70px">
      <div class="loading">
        <v-progress-circular
          :size="80"
          :width="1"
          color="primary"
          indeterminate
          style="transform: rotateY(180deg)"
        ></v-progress-circular>
      </div>
    </v-container>

    <transition name="bounce">
      <v-container v-if="words.length != 0" fluid style="padding:8px">
        <v-layout align-center justify-center>
          <v-card class="table">
            <v-list two-line>
              <v-list-tile @click>
                <v-list-tile-content style="max-width:calc(100vw - 180px)">
                  <v-text-field
                    style="width:160px;"
                    label="Search for a word"
                    single-line
                    v-model.trim="newWord"
                  ></v-text-field>
                  <div v-if="loader">
                    <v-progress-circular
                      :size="15"
                      :width="2"
                      color="primary"
                      indeterminate
                      style="position:absolute;top:3px;right:10px;"
                    ></v-progress-circular>
                  </div>
                </v-list-tile-content>
                <v-list-tile-content style="max-width:120px;position:absolute; right:5px">
                  <v-tooltip top>
                    <transition name="fade" slot="activator">
                      <v-chip
                        color="primary"
                        text-color="white"
                        style="width:105px;"
                        class="pointer"
                        @click="modalAddWord = true"
                      >Add
                        <v-icon right style="margin-left:36px">add</v-icon>
                      </v-chip>
                    </transition>
                    <span>Congratulation, this word has not been added yet. Let's add it now!</span>
                  </v-tooltip>
                </v-list-tile-content>
              </v-list-tile>

              <template v-for="(word, index) in filteredWords" v-if="!hasBeenReportedByUser(index)">
                <transition name="slide-fade" :key="index">
                  <v-list-tile @click style="border-top:solid 1px rgba(0,0,0,0.07)">
                    <v-list-tile-content
                      style="max-width:calc(100vw - 140px)"
                      @click="openModal(index, word)"
                    >
                      <div>
                        <v-list-tile-title
                          style="color:#7B8790"
                          :class="{'primary--text':word.userUid == user.currentUser.uid}"
                        >
                          {{word.word}}
                          <span
                            v-if="word.createdOn.seconds * 1000 > new Date().getTime() - 1000*60*60*24 "
                            class="chips-new warning--text"
                          >new</span>
                        </v-list-tile-title>
                        <v-list-tile-sub-title
                          style="color:#7B8790"
                          :class="{'primary--text':word.userUid == user.currentUser.uid}"
                          v-html="word.context"
                        ></v-list-tile-sub-title>
                        <v-list-tile-sub-title
                          style="color:#7B8790;opacity:0.6;margin-top:-5px"
                          :class="{'primary--text':word.learners[user.currentUser.uid]}"
                        >
                          <span style="font-size:11px">
                            {{ numberOfLearners(word.learners) }}
                            <v-icon
                              style="color:#7B8790;font-size:13px;margin-top:-3px"
                              :class="{'primary--text':word.learners[user.currentUser.uid]}"
                            >school</v-icon>
                          </span>
                        </v-list-tile-sub-title>
                      </div>
                    </v-list-tile-content>

                    <v-list-tile-content
                      style="width:60px;padding-left:15px;position:absolute; right:5px;padding-top:20px;"
                    >
                      <v-switch
                        color="primary"
                        value
                        :input-value="wordIsBeingLearned(index)"
                        @click="switcher(index, word)"
                      ></v-switch>
                    </v-list-tile-content>
                  </v-list-tile>
                </transition>
              </template>
              <template v-for="(word, index) in 25" v-if="lastVisible">
                <transition name="slide-fade" :key="index">
                  <v-list-tile style="border-top:solid 1px rgba(0,0,0,0.07)">
                    <v-progress-linear color="grey" height="20" style="border-radius:10px;opacity:0.2" :indeterminate="true"></v-progress-linear>
                  </v-list-tile>
                </transition>
              </template>
            </v-list>
          </v-card>
        </v-layout>
      </v-container>
    </transition>

    <v-dialog v-model="modalAddWord" max-width="290">
      <v-card class="card-modal" height="280">
        <v-card-title class="headline secondary--text">Add a new word</v-card-title>
        <v-card-text>
          <v-text-field v-model="newWord" prepend-icon="stars" label="New word" type="text"></v-text-field>
          <v-text-field
            v-model="newContext"
            prepend-icon="short_text"
            label="Sentence with this word"
            type="text"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <transition name="fade">
            <v-chip
              v-if="newWord && newContext"
              color="primary"
              text-color="white"
              style="width:105px;text-align:center;margin-right:10px;margin-top:-20px"
              class="pointer"
              @click="addNewWord()"
            >
              <span class="pointer" style="text-align:center;width:80px;">Add</span>
            </v-chip>
          </transition>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalReported" max-width="290">
      <v-card class="card-modal" v-if="reporting">
        <v-card-title class="headline secondary--text">Report this word?</v-card-title>
        <v-card-text class="secondary--text" style="margin-top:-15px">
          You will not see anymore this word on your list.
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
            <v-chip
              color="error"
              text-color="white"
              style="width:105px;text-align:center;margin-right:10px;margin-top:-20px"
              class="pointer"
              @click="report()"
            >
              <span class="pointer" style="text-align:center;width:80px;">Report</span>
            </v-chip>
        </v-card-actions>
      </v-card>
      <v-card class="card-modal" v-else>
        <v-card-title class="headline secondary--text">This word has just been reported</v-card-title>
        <v-card-text class="secondary--text" style="margin-top:-15px">
          Thank you for helping us keeping the content of
          <span class="primary--text">Word by word</span> clean and relevant.
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalWord" hide-overlay max-width="300">
      <v-card v-if="!edit" class="card-modal">
        <v-card-title
          v-clipboard:copy="currentWord.word"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="secondary--text selectable"
          style="font-size:30px;"
        >{{currentWord.word}}</v-card-title>
        <v-card-text
          v-clipboard:copy="currentWord.context"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="secondary--text selectable"
          style="margin-top:-15px; font-size:20px"
        >{{currentWord.context}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon v-if="currentWord.userUid === user.currentUser.uid" @click="edit = true">
            <v-icon color="secondary" style="opacity:0.5;">edit</v-icon>
          </v-btn>
          <v-btn icon v-else>
            <v-icon color="secondary" style="opacity:0.5;" @click="modalWord = false, modalReported = true, reporting = true">report</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-text-field v-model="currentWord.word" prepend-icon="stars" label="Word" type="text"></v-text-field>
          <v-text-field
            v-model="currentWord.context"
            prepend-icon="short_text"
            label="Sentence with this word"
            type="text"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <transition name="fade">
            <v-chip
              v-if="currentWord.word && currentWord.context"
              color="primary"
              text-color="white"
              style="width:105px;text-align:center;margin-right:10px;margin-top:-20px"
              class="pointer"
              @click="modifyWord()"
            >
              <span class="pointer" style="text-align:center;width:80px;">Modify</span>
            </v-chip>
          </transition>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <snackbar/>
  </div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  name: "Home",
  data() {
    return {
      edit: false,
      learning: false,
      modalWord: false,
      currentWord: "",
      currentIndex: "",
      context: "",
      newWord: "",
      newContext: "",
      modalAddWord: false,
      modalReported: false,
      reporting: false
    };
  },
  components: {
    AllowNotifications: () => import("@/components/AllowNotifications"),
    Snackbar: () => import("@/components/Snackbar"),
    Toolbar: () => import("@/components/Toolbar")
  },
  watch: {
    modalWord: function (val) {
      if(val === false) this.edit = false
    },
    modalReport: function (val) {
      if(val === false) this.reporting = false
    },
  },
  computed: {
    ...mapState(["user"]),
    words() {
      return this.$store.state.words.words;
    },
    loader() {
      return this.$store.state.words.loader;
    },
    isGettingNextWords() {
      return this.$store.state.words.isGettingNextWords;
    },
    lastVisible() {
      return this.$store.state.words.lastVisible;
    },
    filteredWords() {
      return this.words.filter(word => {
        return word.word
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            this.newWord
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
      });
    }
  },
  mounted() {
    this.scroll(this.words);
  },
  methods: {
    scroll(person) {
      window.onscroll = () => {
        if (
          document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 2000 && !this.isGettingNextWords && this.lastVisible
          ) {
            console.log("oki")
          this.$store.dispatch("getNextWords")
        }
      };
    },

    onCopy: function(e) {
      this.$store.commit("SET_SNACKBAR", "Copied to clipbaord!");
    },
    onError: function(e) {
      this.$store.commit("SET_SNACKBAR", "Copied to clipbaord!");
    },
    numberOfLearners(learners) {
      return Object.keys(learners).length;
    },
    openModal(index, word) {
      this.currentIndex = index;
      this.currentWord = word;
      this.modalWord = true;
    },
    uniqueWord() {
      if (this.filteredWords.length == 0) {
        return true;
      } else {
        for (let i = 0, len = this.filteredWords.length; i < len; i++) {
          return (
            this.filteredWords[i].word
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") !=
            this.newWord
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
        }
      }
    },
    hasBeenReportedByUser(index) {
      return index > this.words.length && this.words[index].reported
        ? false
        : this.words[index].reported.indexOf(this.user.currentUser.uid) > -1;
    },
    wordIsBeingLearned(index) {
      return (
        //this.filteredWords[index]["learners"].indexOf(this.user.currentUser.uid) > -1
        this.filteredWords[index].learners[this.user.currentUser.uid]
      );
    },
    modifyWord() {
      fb.wordsCollection
        .doc(this.currentWord.wordUid)
        .update(this.currentWord)
        .catch(err => {
          console.log(err);
        });
      this.$store.commit("SET_SNACKBAR", "Your word has been modified");
      this.edit = false;
    },
    addNewWord() {
      if (this.newWord) {
        let wordDetails = {
          word: this.newWord,
          context: this.newContext,
          //learners: [this.user.currentUser.uid],
          learners: {},
          reported: [],
          userUid: this.user.currentUser.uid,
          createdOn: new Date(),
          language: this.user.userProfile.language
        };
        wordDetails.learners[this.user.currentUser.uid] = true;
        //console.log(wordDetails)
        fb.wordsCollection.add(wordDetails).catch(err => {
          console.log(err);
        });
        this.$store.commit(
          "SET_SNACKBAR",
          "Congratulation, your new word has been added"
        );
        this.newWord = "";
        this.newContext = "";
      }
      this.modalAddWord = false;
    },
    report() {
      this.words[this.currentIndex].reported.push(this.user.currentUser.uid);
      fb.wordsCollection
        .doc(this.currentWord.wordUid)
        .update({ reported: this.words[this.currentIndex].reported });
      this.reporting = false
    },
    switcher(index, word) {
      /*if (this.wordIsBeingLearned(index)) {
        this.words[index].learners.splice(
          this.filteredWords[index]["learners"].indexOf(this.user.currentUser.uid),
          1
        );
      } else {
        this.words[index].learners.push(this.user.currentUser.uid);
      }
      fb.wordsCollection
        .doc(word.wordUid)
        .update({ learners: this.words[index].learners });*/
      if (this.filteredWords[index].learners[this.user.currentUser.uid]) {
        delete this.words[index].learners[this.user.currentUser.uid];
      } else {
        this.words[index].learners[this.user.currentUser.uid] = true;
      }
      fb.wordsCollection
        .doc(word.wordUid)
        .update({ learners: this.words[index].learners });
    }
  }
};
</script>

<style scoped>
.chips-new {
  background-color: #5ebcee;
  border-radius: 9px;
  font-size: 10px;
  padding: 3px 6px;
  margin-left: 6px;
}
.chips-learners {
  height: 20px;
  border: solid 1px #7b8790;
  border-radius: 9px;
  font-size: 10px;
  padding: 3px 6px;
  margin-left: 6px;
}
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
