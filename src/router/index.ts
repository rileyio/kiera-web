import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Session from '@/plugins/session'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "logout" */ '../views/Account.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "logout" */ '../views/Logout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const cachedSession = Session.get()

  console.log('route:', to.path)
  console.log('requiresAuth', requiresAuth)
  console.log('isCached', cachedSession)

  // Auth required + Session is MISSING
  if (requiresAuth && !cachedSession) {
    console.log('router before => Auth required, Re-routing to /app/login', to.path)
    next('/app/login')
  }
  if (requiresAuth && cachedSession) {
    console.log('router before => Auth required, Session stored, Proceed!', to.path)
    // Auth required + Session is set
    next()
  }
  // Auth not required
  if (!requiresAuth) {
    console.log('router before => No Auth required!', to.path)
    next()
  }
})

export default router
