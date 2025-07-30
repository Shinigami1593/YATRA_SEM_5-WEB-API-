// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/Auth'; // Import Pinia store
import Login from '../views/Auth/SignIn.vue';
import Register from '../views/Auth/SignUp.vue';
import Home from '@/views/Home.vue';
import AdminDashBoard from '@/views/Admin/AdminDashBoard.vue';
import AddTrip from '@/views/Admin/Trip/AddTrip.vue';
import EditTrip from '@/views/Admin/Trip/EditTrip.vue';
import RoutesDetails from '@/views/Routes/RoutesDetails.vue';
import Profile from '@/views/Profile.vue';
import AdminRoutes from '@/views/Admin/Routes/AdminRoutes.vue';
import Routes from '@/views/Routes/Routes.vue';
import MapView from '@/components/MapView.vue';
// import RoutesDetails from '@/views/Routes/RoutesDetails.vue';
// import AddRoute from '@/views/Admin/AddRoute.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/user/all-routes',
    name: 'Routes',
    component: Routes,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/details-map',
    name: 'Route Details',
    component: RoutesDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView,
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
    path: '/admin/add-trip',
    name: 'TripAdd',
    component: AddTrip,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/route',
    name: 'Route',
    component: AdminRoutes,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/edit-trip/:id',
    name: 'TripEdit',
    component: EditTrip,
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