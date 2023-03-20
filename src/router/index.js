// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/store/app";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: { name: "home" },
  },
  {
    path: "/home",
    name: "home",
    redirect: { name: "products" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      public: true,
    },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/Products.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// public
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (to.matched.some((record) => record.meta.public)) {
    if (!store.user) {
      next();
      return;
    }

    next({ name: "home" });
  } else {
    next();
  }
});

// private
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (!to.matched.some((record) => record.meta.public)) {
    if (store.user) {
      next();
      return;
    }

    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
