<template>
<div>
<v-fab-transition>
     <v-btn
     v-if="notYetAddedToHomeScreen"
        @click="dialog = true"
        color="primary"
        dark
        fab
        fixed
        bottom
        right
      >
        <v-icon>add_to_home_screen</v-icon>
      </v-btn>
      </v-fab-transition>
    
    <v-dialog v-model="dialog" max-width="290">
      <v-card class="card-modal">
        <v-card-title class="headline secondary--text">Add <span class="primary--text"></span> to your home screen?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat="flat" @click.native="dialog = false">later...</v-btn>
          <v-btn color="secondary" flat="flat" @click.native="dialog = false" @click="addToHomeScreen()">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  name: "AddToHomeScreen",
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    notYetAddedToHomeScreen() {
      return this.$store.getters.addToHomeScreen;
    },
    ...mapState(["user"])
  },
  methods: {
    addToHomeScreen() {
      let self = this;
      if (this.notYetAddedToHomeScreen) {
        this.notYetAddedToHomeScreen.prompt();
        this.notYetAddedToHomeScreen.userChoice.then(function(choiceResult) {
          console.log(choiceResult.outcome);
          if (choiceResult.outcome === "dismissed") {
            console.log("User cancelled installation");
          } else {
            console.log("User accepted installation");
            fb.usersCollection.doc(self.user.currentUser.uid).update({
              addedToHomeScreen: true
            });
          }
        });
        this.$store.commit("SET_ADD_TO_HOME_SCREEN", null);
      }
    }
  }
};
</script>

<style scoped>
</style>
