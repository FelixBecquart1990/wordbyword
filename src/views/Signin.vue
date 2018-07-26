<template>
    <div style="background-color:white;width:100vw;height:100vh">
      <div style="width:100%">



      </div>
      <div class="gif-content">
        <img src="../assets/walking.gif" style="transform:rotateY(180deg)" alt="walking guy" class="walking-guy">
      </div>
      <div mt-4>
        <div class="button-content">
          <div class="button-create elevation-3" @click="signInAnonymously()">
            <h1 class="button-text">
              <span v-if="!loading">Learn new vocabulary</span>
              <v-progress-circular
                v-else
                indeterminate
                color="warning"
              ></v-progress-circular>
            </h1>
          </div>
        </div>
      </div>
      <p class="voca secondary--text">with smart reminders</p>
      <!--div style="display:flex;justify-content:center">
        <v-progress-linear class="loading" :indeterminate="true"></v-progress-linear>
      </div-->
      <div style="width:100%;padding:10px;margin-top:0px;">

<transition name="slide-fade">
      <div class="card" v-if="toggle">
        <div class="icon"></div>
        <div class="badge"></div>
        <div class="texts">
          <div style="margin-top:10px;font-size:18px;font-family: arial;">{{word}}</div>
          <div class="secondary--text" style="font-family: arial;">{{context}}</div>
        </div>
        <div class="time secondary--text" style="font-size:12px;font-family: arial;position:absolute;top:15px;right:8px">9:24
        </div>
      </div>
</transition>
      </div>

    </div>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  name: "Signin",
  data() {
    return {
      toggle: false,
      word: "",
      context: "",
      sample: [
        { word: "Curtain", context: "Could you close the curtains please ?" },
        { word: "To overcome", context: "We overcame so many hardships" },
        { word: "Doubt", context: "I don't have any doubt about that" },
        { word: "To discover", context: "He likes to discover new words" },
        { word: "Candle", context: "This candle will soon go out" },
        { word: "Clever", context: "What a clever man" }
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.state.utilities.loading;
    }
  },
  mounted() {
    setInterval(this.appear, 1350);
  },
  methods: {
    signInAnonymously() {
      this.$store.commit("SET_LOADING", true);
      fb.auth
        .signInAnonymously()
        .then(cred => {
          this.$store.commit("SET_CURRENT_USER", cred.user);
          fb.usersCollection
            .doc(cred.user.uid)
            .set({
              createdOn: new Date(),
              language: "English",
              notificationsFrequency: "every day"
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.$router.push("/");
              this.$store.commit("SET_LOADING", false);
            })
            .catch(err => {
              console.log(err);
              this.$store.commit("SET_LOADING", false);
            });
        })
        .catch(function(error) {
          console.log(error);
          this.$store.commit("SET_LOADING", false);
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    },
    appear() {
      this.toggle = !this.toggle;
      if (this.toggle) {
        let item = this.sample[Math.floor(Math.random() * this.sample.length)];
        this.word = item.word;
        this.context = item.context;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.voca {
  text-align: center;
  position: fixed;
  bottom: 15px;
  width: 100%;
}
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
.walking-guy {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}
.gif-content {
  width: 100%;
  position: fixed;
  bottom: 120px;
}
.texts {
  position: absolute;
  top: 0px;
  left: 80px;
}
.badge {
  background-image: url("../assets/badge.png");
  background-size: 100%;
  height: 20px;
  width: 20px;
  bottom: 10px;
  left: 45px;
  position: absolute;
}
.icon {
  background-image: url("../assets/icon.png");
  background-size: 80%;
  height: 60px;
  width: 60px;
  margin-top: 11px;
  margin-left: 12px;
  position: relative;
}
.card {
  height: 70px;
  border-radius: 3px;
  max-width: 400px;
  margin: 10px;
  margin-right: auto;
  margin-left: auto;
  position: relative;
  background-color: #fafafa;
}
.loading {
  position: fixed;
  bottom: 100px;
  width: 20%;
  border-radius: 5px;
}
.button-create {
  cursor: pointer;
  border-radius: 45px;
  background-color: #23a6d5;
  height: 50px;
  width: 280px;
  margin-right: auto;
  margin-left: auto;
}
.button-content {
  position: fixed;
  bottom: 70px;
  width: 100%;
}
.button-text {
  text-align: center;
  color: #fff;
  font-size: 20px;
  padding-top: 11px;
  width: 100%;
}
</style>
