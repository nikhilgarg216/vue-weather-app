import { createRouter, createWebHistory } from "vue-router"; 

const routes = [
  
  {
    path: "/",
    name: "main",
    component: function () {
      return import("../views/MainPage.vue");
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
