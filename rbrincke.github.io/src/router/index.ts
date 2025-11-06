import { articles } from '@/contents';
import Contents from '@/Contents.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Contents }
  ],
});

for (const article of articles) {
  router.addRoute({ path: '/' + article.link, component: article.component })
}

console.log(router.getRoutes());

export default router;
