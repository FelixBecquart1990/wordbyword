import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import Home from './views/Home.vue'
import Ideas from './views/Ideas.vue'
import Profile from './views/Profile.vue'
import Signin from './views/Signin.vue'

Vue.use(Router)

const router = new Router({
  mode:"history",
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ideas',
      name: 'ideas',
      component: Ideas,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  if (requiresAuth && !currentUser) {
      next('/signin')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router