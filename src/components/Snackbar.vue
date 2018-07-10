<template>
    <v-snackbar
      :timeout="timeout"
      top
      v-model="snackbar.activated"
      auto-height
      color="primary"
    >
      {{ snackbar.text }}
    </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Snackbar",
  data() {
    return {
      timeout: 2800
    };
  },
  computed: {
    ...mapState(["snackbar"])
  }
};
</script>

