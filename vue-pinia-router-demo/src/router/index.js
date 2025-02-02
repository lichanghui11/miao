import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      component: () => import("../views/HomeView.vue"),
      children: [
        {
          path: "chat",
          name: "chat",
          component: () => import("../views/ChatView.vue"),
        },
        {
          path: "contact",
          name: "contact",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/ContactView.vue"),
        },
        {
          path: "discover",
          name: "discover",
          component: () => import("../views/DiscoverView.vue"),
        },
        {
          path: "mine",
          name: "mine",
          component: () => import("../views/MineView.vue"),
        },
      ],
    },
    {
      path: '/monster',
      name: 'monster',
      component: () => import('../views/MonsterView.vue')
    },
    {
      path: '/gangster',
      name: 'gangster',
      component: () => import('../views/GangsterView.vue')
    },
    {
      path: '/lister',
      name: 'lister',
      component: () => import('../views/ListerView.vue')
    },
    {
      path: '/gentleman',
      name: 'gentleman',
      component: () => import('../views/GentlemanView.vue')
    },
    {
      path: '/chat/:id',
      name: 'stranger',
      component: () => import('../views/StrangerView.vue')
    }
  ],
});

export default router;
