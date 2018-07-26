<template>
<div>
<transition name="slide-fade">
  <div v-if="!notificationsActivated">
    <v-container fluid style="padding:8px">
      <v-layout align-center justify-center @click="notificationsRequest()">
        <v-card class="table" style="padding:15px">

          <v-list>

            <v-list-tile>
                <v-icon class="pointer" large color="primary" style="margin-left:-10px">notifications</v-icon>

              <v-list-tile-content>
                <h3  class="pointer primary--text ml-3" style="font-weight:normal;max-width:calc(100vw - 180px)">
                  Activate smart reminders
                </h3>
              </v-list-tile-content>

              <v-list-tile-content style="width:60px;padding-left:13px;position:absolute; right:5px;padding-top:11px;">
                <v-switch color="primary" v-model="notificationsActivated"></v-switch>
              </v-list-tile-content>
            </v-list-tile>

        </v-list>

        </v-card>
      </v-layout>
    </v-container>
  </div>
</transition>

        <v-snackbar
      v-model="snackbar"
      :timeout="timer"
      top
      color="primary"
    >
      {{ snackbarText }}
    </v-snackbar>

</div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  name: "AllowNotifications",
  data() {
    return {
      timer: 3500,
      snackbar: false,
      snackbarText: "",
      notificationsActivated: true
    };
  },
  computed: {
    ...mapState(["user"])
  },
  created() {
    this.notificationsGranted();
    fb.messaging.onTokenRefresh(token => {
      this.refreshToken();
    });
  },
  methods: {
    refreshToken() {
      self = this;
      return fb.messaging.getToken().then(function(token) {
        console.log(token);
        fb.usersCollection
          .doc(self.user.currentUser.uid)
          .update({
            token: token
          })
          .then(
            self.$store.commit("SET_SNACKBAR", "Smart reminders activated")
          );
        self.notificationsGranted();
      });
    },
    notificationsGranted() {
      if (
        "Notification" in window &&
        "serviceWorker" in navigator &&
        Notification.permission == "granted"
      ) {
        //console.log("notificationsGranted: ", Notification.permission);
      } else {
        //console.log("notification not activated");
        return (this.notificationsActivated = false);
      }
    },
    notificationsRequest() {
      self = this;
      fb.messaging
        .requestPermission()
        .then(function() {
          self.refreshToken();
        })
        .catch(function(err) {
          //gestion du refus (modal pour inviter l'utilisateur à réactiver les notifications manuellement)
          console.log("error occured");
          self.notificationsActivated = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
