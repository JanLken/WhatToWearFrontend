// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Menu from "../views/Menu.vue";
import WhatCanIWear from "../views/WhatCanIWear.vue";
import Settings from "../views/Settings.vue";
import Logout from "../views/Logout.vue";
import RemoveAddClothes from "../views/RemoveAddClothes.vue";

const routes = [
  { path: "/", component: Menu },
  { path: "/removeAddClothes", component: RemoveAddClothes },
  { path: "/what-can-i-wear", component: WhatCanIWear },
  { path: "/settings", component: Settings },
  { path: "/logout", component: Logout },
  // ... (other routes)
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
