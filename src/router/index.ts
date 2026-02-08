import { articles } from '@/articles/list';
import Contents from '@/components/Contents.vue';
import { link } from '@/components/header';
import About from '@/pages/about.vue';
import { createRouter, createWebHistory } from 'vue-router'
import Loader from '@/components/puzzle-game/loader.vue';
import Game from '@/components/puzzle-game/game.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Contents },
    { path: '/about', component: About },
    { path: '/puzzle-game', component: Loader },
    { path: '/puzzle-game/game', component: Game }
  ],
});

for (const [id, article] of Object.entries(articles)) {
  router.addRoute({ path: link(id), component: article.component })
}

export default router;
