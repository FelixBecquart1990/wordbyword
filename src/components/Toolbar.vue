<template>
  <div class="info">
    <v-navigation-drawer v-model="drawer" absolute temporary style="position:fixed; top:0; left:0;">
      <v-toolbar flat class="transparent" height="64" @click="$router.push('/profile')" style="cursor:pointer">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="../assets/profile.svg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="secondary--text">Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
              <v-divider></v-divider>

      <v-list class="pt-0" dense>


        <v-list-tile class="my-2" @click="$router.push('/')">
          <v-list-tile-action>
            <v-icon color="secondary">stars</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="secondary--text">Words</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <div v-if="notificationsAllowed()">
          <v-menu
          v-model="menuNotifications"
          bottom
          offset-x
          >
            <v-list-tile slot="activator" class="my-2">
                <v-list-tile-action>
                  <v-icon v-if="user.userProfile.notificationsFrequency == 'turned off'" color="secondary">notifications_paused</v-icon>
                  <v-icon v-else color="secondary">notifications</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title class="secondary--text">Smart reminders {{user.userProfile.notificationsFrequency}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            <v-list>
              <v-list-tile v-for="(item, index) in notificationsFrequencyList" :key="index" @click="modifyNotificationsFrenquency(item)">
                <v-list-tile-title style="color:#7B8790" :class="{'primary--text':item.value == user.userProfile.notificationsFrequency}">{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>

      </v-list>
        <v-divider></v-divider>
      <v-list class="pt-0" dense>
      <div>
          <v-menu
          v-model="menuLanguages"
          bottom
          offset-x
          >
            <v-list-tile slot="activator" class="my-2">
                <v-list-tile-action>
                  <v-icon color="secondary">language</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title class="secondary--text">Learning language : {{user.userProfile.language || "English"}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            <v-list>
              <v-list-tile v-for="(item, index) in languages" :key="index" @click="modifyLanguage(item.value)">
                <v-list-tile-title style="color:#7B8790" :class="{'primary--text':item.value == user.userProfile.language}">{{ item.language }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </v-list>
        <v-divider></v-divider>

      <v-list class="pt-0" dense>
        <v-list-tile class="my-2" @click="$router.push('/ideas')">
          <v-list-tile-action>
            <v-icon color="secondary" style="transform:rotate(180deg)">wb_incandescent</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="secondary--text">Help us to improve</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar
    height="64"
      class="elevation-0"
      style="border-bottom:solid 1px rgba(0,0,0,0.07);background-color:white;"
      fixed
    >
      <v-toolbar-side-icon color="secondary--text" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
     
      <v-toolbar-title @click="$router.push('/')" class="primary--text" style="font-weight:bold; cursor:pointer" v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <!--v-chip v-if="true" outline color="primary"><span style="color:#5EBCEE">Sign up</span></v-chip-->
        <div style="margin-right:0px" v-if="notificationsAllowed()">
          <v-menu
          v-model="menuNotifications2"
          bottom
          offset-x
          >

            <v-list-tile slot="activator" class="my-2">
              <v-tooltip left :disabled="$vuetify.breakpoint.xsOnly">
                <v-list-tile-action slot="activator">
                     
                  <v-icon large  v-if="user.userProfile.notificationsFrequency == 'turned off'" color="secondary">notifications_paused</v-icon>

                  <v-badge v-else overlap color="red">
                    <v-icon slot="badge" dark small>star</v-icon>

                  <v-icon large color="secondary">notifications</v-icon>

                  </v-badge>
                </v-list-tile-action>
                <span>Smart reminders</span>
              </v-tooltip>
            </v-list-tile>

            <v-list>
              <v-list-tile v-for="(item, index) in notificationsFrequencyList" :key="index" @click="modifyNotificationsFrenquency(item)">
                <v-list-tile-title style="color:#7B8790" :class="{'primary--text':item.value == user.userProfile.notificationsFrequency}">{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
    </v-toolbar>

    <snackbar/>    
    <AddToHomeScreen/>


  </div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

export default {
  name: "App",
  data() {
    return {
      menuNotifications: false,
      menuNotifications2: false,
      menuLanguages: false,
      drawer: false,
      notificationsFrequencyList: [
        {
          title: "Every 30 minutes",
          value: "every 30 minutes"
        },
        // {
        //   title: "Every hour",
        //   value: "every hour"
        // },
        // {
        //   title: "Every 2 hours",
        //   value: "every 2 hours"
        // },
        {
          title: "Every day",
          value: "every day"
        },
        {
          title: "Turn off",
          value: "turned off"
        }
      ],
      languages: [
        {
          language: "English",
          value: "English"
        },
        {
          language: "French",
          value: "French"
        },
        {
          language: "Vietnamese",
          value: "Vietnamese"
        }
      ],
      title: "Word by word"
    };
  },
  created() {
    self = this;
    fb.messaging.onMessage(function(payload) {
      //console.log('onMessage: ', payload)
      self.$store.commit(
        "SET_SNACKBAR",
        payload.notification.title + "\n" + payload.notification.body
      );
    });
  },
  components: {
    Snackbar: () => import("@/components/Snackbar"),
    AddToHomeScreen: () => import("@/components/AddToHomeScreen")
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    notificationsAllowed() {
      return "Notification" in window && "serviceWorker" in navigator
        ? Notification.permission == "granted"
        : false;
    },
    modifyNotificationsFrenquency(item) {
      //this.$store.commit("SET_NOTIFICATIONS_FREQUENCY", item.value);
      this.$store.commit("SET_SNACKBAR", "Smart reminders " + item.value);
      fb.usersCollection.doc(this.user.currentUser.uid).update({
        notificationsFrequency: item.value
      });
    },
    modifyLanguage(newLanguage) {
      this.$store.commit("SET_LANGUAGE", newLanguage);
      this.$store.dispatch("getWords");
      //this.$store.dispatch("getWords", newLanguage);
      fb.usersCollection.doc(this.user.currentUser.uid).update({
        language: newLanguage
      });
    }
  }
};
</script>

<style>
</style>
