import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Auth/SignIn.vue';
import Register from '../views/Auth/SignUp.vue';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: "Home",
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !AuthService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
