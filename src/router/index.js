import LandingPage from '@/pages/LandingPage.vue';
import MainPage from '@/pages/MainPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MainPage },
    { path: '/login', component: LandingPage },
  ],
});

export default router;
