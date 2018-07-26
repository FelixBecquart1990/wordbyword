<template>
  <v-app class="info">

    <v-content>
      <router-view/>
    </v-content>

    <modalAccessDenied/>

  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    ModalAccessDenied: () => import("@/components/ModalAccessDenied")
  }
};
</script>

<style>
* {
  font-family: mainFont;
  /*color:#7B8790*/
}
**,
*:active,
*:focus {
  user-select: none;
  outline: none;
  text-decoration: none;
}

@font-face {
  font-family: mainFont;
  src: url("./assets/gothamrnd-medium.ttf");
}
.border-all * {
  border: solid 1px red;
}
.opacity {
  opacity: 0.3;
}
.pointer {
  cursor: pointer;
}
.table {
  width: 1000px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 3px 20px -4px hsla(206, 9%, 52%, 0.45);
}
.card-modal {
  border-radius: 10px;
  background-color: #fff;
}

.loading {
  background-image: url(./assets/walking.gif);
  background-position: center;
  background-size: 80px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: white;
  transform: rotateY(180deg);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1);
  }
}
</style>
