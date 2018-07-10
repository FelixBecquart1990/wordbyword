<template>
<div>
  <toolbar/>
  <v-container v-if="ideas" fill-height fluid style="border-bottom:solid 1px rgba(0,0,0,0.07); background-color:white; min-height:100px">
      <v-layout column align-center justify-center>
        <v-flex>
          <h2 class="secondary--text" style="font-weight:normal;text-align:center" :class="{'text-xs-left':$vuetify.breakpoint.xsOnly}">Your ideas to improve <span class="primary--text">Word by word</span></h2>
        </v-flex>
        <v-flex style="width:100%;">
          <h3 class="secondary--text" style="font-weight:normal;text-align:center" :class="{'text-xs-left':$vuetify.breakpoint.xsOnly}">Upvote or downvote for ideas</h3>
        </v-flex>
      </v-layout>
  </v-container>

    <v-container v-if="ideas.length == 0" style="margin-top:70px">
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
    <v-container fluid style="padding:8px">
        <v-layout align-center justify-center>
        <v-card class="table">
          
        <v-list two-line>

            <v-list-tile>

              <v-list-tile-content class="ml-3">
                  <v-text-field
                    style="width:150px;"
                    label="add your idea"
                    single-line
                    v-model="newIdea"
                  ></v-text-field>
                <v-list-tile-sub-title  class="secondary--text"></v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-content style="max-width:120px;position:absolute; right:5px" :class="{'opacity':newIdea.length<1}">
              <v-chip color="primary" text-color="white" style="width:105px;" @click="addNewIdea">
                <span class="pointer">Add</span>
              <v-icon right class="pointer" style="margin-left:36px">add</v-icon>
            </v-chip>

              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="(idea, index) in ideas" :key="index" @click="" v-if="!hasBeenReportedByUser(index)">
                <div style="display:flex;flex-direction:column;" class="mr-4" @click="toggleVote(index, idea)">
                  <v-icon :class="{'primary--text':containUserUpvote(index)}" style="transform:rotate(90deg);margin-bottom:-10px">arrow_back_ios</v-icon>
                  <span class="secondary--text" style="width:50px;text-align:center">{{ idea.votesSum }}</span>
                  <v-icon :class="{'primary--text':containUserDownvote(index)}" style="transform:rotate(-90deg);margin-top:-10px">arrow_back_ios</v-icon>
                </div>
              <v-list-tile-content style="max-width:calc(90vw - 180px)" @click="openModal(idea)">
                <v-list-tile-title style="color:#7B8790" :class="{'primary--text':idea.userUid == 'userUid'}">{{ idea.idea}}</v-list-tile-title>
                <v-list-tile-sub-title  class="secondary--text"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content style="max-width:155px;position:absolute; right:5px">
                <v-tooltip top v-if="idea.developed">
                  <v-chip slot="activator" color="success" text-color="white" style="width:90px;font-size:10px" class="pointer">
                  developped
                </v-chip>
                  <span>This feature is now available</span>
                </v-tooltip>
                <v-tooltip top v-else-if="idea.inDevelopment">
                  <v-chip slot="activator" color="accent" text-color="white" style="width:90px;font-size:8px" class="pointer">
                  in development
                </v-chip>
                  <span>This feature is being developped. It can takes some weeks before to be released</span>
                </v-tooltip>
                <span v-else @click.prevent="report(index, idea)" style="text-decoration:underline;font-size:13px;opacity:0.6;text-align:right;padding-right:10px;width:100%" class="secondary--text">report</span>
              </v-list-tile-content>
            </v-list-tile>



        </v-list>

        </v-card>
        </v-layout>
  </v-container>
  </transition>


  <v-dialog v-model="modalReported" max-width="290">
    <v-card class="card-modal">
      <v-card-title class="headline secondary--text">
        This idea has just been reported
      </v-card-title>
      <v-card-text class="secondary--text" style="margin-top:-15px">
        Thank you for helping us keeping the content of <span class="primary--text">Word by word</span> clean and relevant.
      </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalIdea" hide-overlay max-width="290">
      <v-card class="card-modal">
      <v-card-text class="secondary--text">
      {{ idea }}      
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
      idea: "",
      modalIdea: false,
      modalReported: false,
      newIdea: "",
      ideas: []
    };
  },
  created() {
    self = this;
    fb.ideasCollection.orderBy("votesSum", "desc").onSnapshot(
      function(snapshot) {
        let listIdeas = [];
        snapshot.forEach(idea => {
          listIdeas.push(Object.assign({ ideaUid: idea.id }, idea.data()));
        });
        self.ideas = listIdeas;
      },
      function(error) {
        console.log(error);
      }
    );
  },
  computed: {
    ...mapState(["user"])
  },
  components: {
    Snackbar: () => import("@/components/Snackbar"),
    Toolbar: () => import("@/components/Toolbar")
  },
  methods: {
    openModal(idea) {
      this.idea = idea.idea;
      this.modalIdea = true;
    },
    hasBeenReportedByUser(index) {
      return index > this.ideas.length && this.ideas[index].reported
        ? false
        : this.ideas[index].reported.indexOf(this.user.currentUser.uid) > -1;
    },
    containUserUpvote(index) {
      return index > this.ideas.length && this.ideas[index].upvotes
        ? false
        : this.ideas[index].upvotes.indexOf(this.user.currentUser.uid) > -1;
    },
    containUserDownvote(index) {
      return index > this.ideas.length && this.ideas[index].downvotes
        ? false
        : this.ideas[index].downvotes.indexOf(this.user.currentUser.uid) > -1;
    },
    addNewIdea() {
      if (this.newIdea) {
        fb.ideasCollection
          .add({
            idea: this.newIdea,
            upvotes: [this.user.currentUser.uid],
            downvotes: [],
            reported: [],
            votesSum: 1,
            userUid: this.user.currentUser.uid,
            developed: false,
            inDevelopment: false,
            createdOn: new Date()
          })
          .catch(err => {
            console.log(err);
          });
        this.$store.commit(
          "SET_SNACKBAR",
          "Congratulation, your idea has been added"
        );
        this.newIdea = "";
      }
    },
    report(index, idea) {
      this.modalReported = true;
      this.ideas[index].reported.push(this.user.currentUser.uid);
      fb.ideasCollection
        .doc(idea.ideaUid)
        .update({ reported: this.ideas[index].reported });
    },
    toggleVote(index, idea) {
      if (this.ideas[index].upvotes.indexOf(this.user.currentUser.uid) > -1) {
        this.ideas[index].upvotes.splice(
          this.ideas[index].upvotes.indexOf(this.user.currentUser.uid),
          1
        );
        this.ideas[index].downvotes.push(this.user.currentUser.uid);
        fb.ideasCollection.doc(idea.ideaUid).update({
          upvotes: this.ideas[index].upvotes,
          downvotes: this.ideas[index].downvotes,
          votesSum: this.ideas[index].votesSum - 2
        });
      } else if (
        this.ideas[index].downvotes.indexOf(this.user.currentUser.uid) > -1
      ) {
        this.ideas[index].downvotes.splice(
          this.ideas[index].downvotes.indexOf(this.user.currentUser.uid),
          1
        );
        fb.ideasCollection.doc(idea.ideaUid).update({
          downvotes: this.ideas[index].downvotes,
          votesSum: this.ideas[index].votesSum + 1
        });
      } else {
        this.ideas[index].upvotes.push(this.user.currentUser.uid);
        fb.ideasCollection.doc(idea.ideaUid).update({
          upvotes: this.ideas[index].upvotes,
          votesSum: this.ideas[index].votesSum + 1
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
