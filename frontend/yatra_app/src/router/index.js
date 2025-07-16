// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/Auth'; // Import Pinia store
import Login from '../views/Auth/SignIn.vue';
import Register from '../views/Auth/SignUp.vue';
import Home from '@/views/Home.vue';
import AdminDashBoard from '@/views/Admin/AdminDashBoard.vue';
import AddRoute from '@/views/Admin/AddRoute.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin/dashboard',
    name: 'Admin',
    component: AdminDashBoard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/addRoute',
    name: 'routeAdd',
    component: AddRoute,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/'); // Redirect to login if not authenticated
  } else if (to.meta.requiresAdmin && !['admin', 'superadmin', 'moderator'].includes(authStore.getRole)) {
    next('/home'); // Redirect non-admins to home
  } else {
    next();
  }
});

export default router;