import { articles } from '@/articles/list';
import Contents from '@/components/Contents.vue';
import { link } from '@/components/header';
import About from '@/pages/about.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Contents },
    { path: '/about', component: About }
  ],
});

for (const [id, article] of Object.entries(articles)) {
  router.addRoute({ path: link(id), component: article.component })
}

export default router;
