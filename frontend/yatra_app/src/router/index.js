import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Auth/SignIn.vue';
import Register from '../views/Auth/SignUp.vue';
import Home from '@/views/Home.vue';
import AdminDashBoard from '@/views/Admin/AdminDashBoard.vue';
import UserAdd from '@/views/Admin/UserAdd.vue';
import AddRoute from '@/views/Admin/AddRoute.vue';

const routes = [
  {
    path: '/home',
    name: "Home",
    component: Home
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashBoard,
    // meta: {
    //   requiresAuth: true,
    //   roles: ['superadmin','moderator']
    // }
  },
  {
    path: '/addUser',
    name: 'userAdd',
    component : UserAdd
  },
  {
    path: '/admin/addRoute',
    name: 'routeAdd',
    component : AddRoute
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
