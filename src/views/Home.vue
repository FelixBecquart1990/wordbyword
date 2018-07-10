<template>
<div>
  <toolbar/>
  <v-container fill-height fluid style="border-bottom:solid 1px rgba(0,0,0,0.07); background-color:white; min-height:100px">
      <v-layout column align-center justify-center>
        <v-flex>
          <h2  class="secondary--text" style="font-weight:normal;">Select the 
          <v-tooltip bottom>
          <span slot="activator" class="primary--text">words</span>
          <span>You will receive silent notifications to help you to remember these words</span>
          </v-tooltip>
           you want to learn
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

            <v-list-tile @click="">
              <v-list-tile-content style="max-width:calc(100vw - 180px)">
                  <v-text-field
                    style="width:160px;"
                    label="Search for a word"
                    single-line
                    v-model.trim="newWord"
                  ></v-text-field>
                <v-list-tile-sub-title  class="secondary--text"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content style="max-width:120px;position:absolute; right:5px">
            <v-tooltip top>
              <transition name="fade" slot="activator">
              <v-chip  v-if="uniqueWord() && newWord.length>0" color="primary" text-color="white" style="width:105px;" class="pointer" @click="modalAddWord = true">
              Add
              <v-icon right style="margin-left:36px">add</v-icon>
            </v-chip>
              </transition>
              <span>Congratulation, this word has not been added yet. Let's add it now!</span>
            </v-tooltip>
              </v-list-tile-content>
            </v-list-tile>

          <template v-for="(word, index) in filteredWords" v-if="!hasBeenReportedByUser(index)">
            <transition name="slide-fade" :key="index">
            <v-list-tile @click="">
              <v-list-tile-content style="max-width:calc(100vw - 140px)" @click="openModal(index, word)">
                <div>
                <v-list-tile-title style="color:#7B8790" :class="{'primary--text':word.userUid == user.uid}">
                  {{word.word}}
                  <span v-if="word.createdOn.seconds * 1000 > new Date().getTime() - 1000*60*60*24 " class="chips-new warning--text">new</span>
                </v-list-tile-title>
                <v-list-tile-sub-title  class="secondary--text" v-html="word.context"></v-list-tile-sub-title>
                </div>
              </v-list-tile-content>



              <v-list-tile-content style="width:60px;padding-left:13px;position:absolute; right:5px;padding-top:20px;">
                <v-switch color="primary" value :input-value="wordIsBeingLearned(index)" @click="switcher(index, word)"></v-switch>
              </v-list-tile-content>



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
      <v-card-title class="headline secondary--text">
        Add a new word
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newWord" prepend-icon="stars" label="New word" type="text"></v-text-field>
        <v-text-field v-model="newContext" prepend-icon="short_text" label="Sentence with this word" type="text"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <transition name="fade">
          <v-chip v-if="newWord && newContext" color="primary" text-color="white" style="width:105px;text-align:center;margin-right:10px;margin-top:-20px" class="pointer" @click="addNewWord()">
            <span class="pointer" style="text-align:center;width:80px;">Add</span>
          </v-chip>
        </transition>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalReported" max-width="290">
    <v-card class="card-modal">
      <v-card-title class="headline secondary--text">
        This word has just been reported
      </v-card-title>
      <v-card-text class="secondary--text" style="margin-top:-15px">
        Thank you for helping us keeping the content of <span class="primary--text">Word by word</span> clean and relevant.
      </v-card-text>
      </v-card>
    </v-dialog>

      <v-dialog v-model="modalWord" hide-overlay max-width="290">
    <v-card class="card-modal">
      <v-card-title class="headline secondary--text">
        {{currentWord.word}}
      </v-card-title>
      <v-card-text class="secondary--text" style="margin-top:-15px">
        {{currentWord.context}}
      </v-card-text>
      <v-card-text style="margin-top:-15px;">
        <div style="text-align:right">
          <span @click.prevent="report()" style="text-decoration:underline;font-size:13px;opacity:0.6;" class="secondary--text">report</span>
        </div>
      </v-card-text>
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
      learning: false,
      modalWord: false,
      currentWord: "",
      currentIndex: "",
      context: "",
      newWord: "",
      newContext: "",
      modalAddWord: false,
      modalReported: false
    };
  },
  components: {
    AllowNotifications: () => import("@/components/AllowNotifications"),
    Snackbar: () => import("@/components/Snackbar"),
    Toolbar: () => import("@/components/Toolbar")
  },
  computed: {
    ...mapState(["user"]),
    words() {
      return this.$store.state.words.words;
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
  methods: {
    test() {
      console.log("okiiiii");
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
            this.filteredWords[i].word.toLowerCase() !=
            this.newWord.toLowerCase()
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
        this.find(index, "learners").indexOf(this.user.currentUser.uid) > -1
      );
    },
    find(index, type) {
      return this.filteredWords[index][type];
    },
    addNewWord() {
      if (this.newWord) {
        fb.wordsCollection
          .add({
            word: this.newWord,
            context: this.newContext,
            learners: [this.user.currentUser.uid],
            reported: [],
            userUid: this.user.currentUser.uid,
            createdOn: new Date(),
            language: this.user.userProfile.language
          })
          .catch(err => {
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
      this.modalWord = false;
      this.modalReported = true;
      this.words[this.currentIndex].reported.push(this.user.currentUser.uid);
      fb.wordsCollection
        .doc(this.currentWord.wordUid)
        .update({ reported: this.words[this.currentIndex].reported });
    },
    switcher(index, word) {
      if (this.wordIsBeingLearned(index)) {
        this.words[index].learners.splice(
          this.find(index, "learners").indexOf(this.user.currentUser.uid),
          1
        );
      } else {
        this.words[index].learners.push(this.user.currentUser.uid);
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
