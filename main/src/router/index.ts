import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, form) => {
  console.log('测试', to.path)
})
export default router;
