import { createRouter, createWebHashHistory } from "vue-router"

const router = createRouter({
  // hash模式：createWebHashHistory，history模式：createWebHistory
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("@render/views/Home/index.vue"),
      meta: {
        index: 1,
        keepAlive: true
      }
    },
    {
      path: "/about",
      name: "About",
      component: () => import("@render/views/About/index.vue"),
      meta: {
        index: 2,
        keepAlive: false
      }
    }
  ]
})

export default router
