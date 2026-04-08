import LandingPage from '@/pages/LandingPage.vue';
import MainPage from '@/pages/MainPage.vue';
import { useUserStore } from '@/stores/user';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'main', component: MainPage, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LandingPage },
  ],
});

router.beforeEach((to) => {
  const authStore = useUserStore();

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login' };
  }
  if (to.name === 'login' && authStore.user) {
    return { name: 'main' };
  }
});

export default router;
