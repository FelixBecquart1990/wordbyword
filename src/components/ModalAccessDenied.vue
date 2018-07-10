<template>
    
    <v-dialog v-model="modalAccessDenied" max-width="290" persistent>
    <v-card class="card-modal">
      <v-card-title class="headline secondary--text">
        Notifications are not supported here &#9973;
      </v-card-title>
      <v-card-text>
        <p class="secondary--text">Try to open this app from <br><span class="success--text">Google Chrome</span></p>
        <p class="secondary--text">Web notifications are not yet available from IOS devices</p>
      </v-card-text>
      </v-card>
    </v-dialog>

</template>

<script>
export default {
  name: "ModalAccessDenied",
  data() {
    return {
      modalAccessDenied: false,
    }
  },
  mounted() {
    //console.log("oki")
    return ("Notification" in window && "serviceWorker" in navigator) ? this.modalAccessDenied = false : this.modalAccessDenied = true
  }
};
</script>

<style>
</style>
