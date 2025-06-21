<template>
  <nav class="app-nav" v-if="!isAuthPage || !isAdminPage">
    <div class="nav-content">
      <div class="logo">
        <h1>Yatra</h1>
      </div>
      <div class="nav-links">
        <a href="/home" @click="setCurrentPage('home')" :class="{ active: currentPage === 'home' }">Home</a>
        <a href="/route" @click="setCurrentPage('about')" :class="{ active: currentPage === 'route' }">Route</a>
        <a href="/schedule" @click="setCurrentPage('schedule')" :class="{ active: currentPage === 'schedule' }">Schedule</a>
        <a href="/stops" @click="setCurrentPage('stops')" :class="{ active: currentPage === 'stops' }">Stops</a>
        <a href="#" @click.prevent="logout" class="profile-btn">
          <i class="bi bi-person-fill"></i>
        </a>
      </div>
      <!-- <div class="nav-actions">
        <template>
        </template>
        <!-- <template v-else>
          <a href="/" @click="setCurrentPage('signin')" class="login-btn">
            <i class="bi bi-person-fill"></i>
            Login
          </a>
          <a href="/register" @click="setCurrentPage('signup')" class="signup-btn">
            <i class="bi bi-person-plus-fill"></i>
            Sign Up
          </a>
        </template> -->
      <!-- </div> --> 
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

const router = useRouter();
const authStore = useAuthStore();
const currentPage = ref('home');
const isAuthPage = computed(() => ['/', '/register'].includes(router.currentRoute.value.path));
const isAdminPage = computed(() => router.currentRoute.value.path.startsWith('/admin'));

const setCurrentPage = (page) => {
  currentPage.value = page;
};

const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0f0f0f;
  color: #ffffff;
}

/* Navigation Styles */
.app-nav {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 214, 100, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.login-btn, .signup-btn, .profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.login-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.signup-btn {
  background-color: white;
  color: #00D664;
}

.profile-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem; /* Adjust size for icon */
}

.login-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.signup-btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Main Content */
.main-content {
  flex: 1;
}

.page {
  min-height: calc(100vh - 80px);
}

/* Home Page Styles */
.home-page {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 70vh;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00D664 0%, #00F070 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a0a0a0;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 214, 100, 0.4);
}

.cta-button.secondary {
  background-color: transparent;
  color: #00D664;
  border: 2px solid #00D664;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.cta-button.primary:hover {
  box-shadow: 0 6px 16px rgba(0, 214, 100, 0.5);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Features Section */
.features-section {
  padding: 4rem 2rem;
  background-color: #1a1a1a;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features-container h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 3rem;
  color: #00D664;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.feature-card p {
  color: #a0a0a0;
  line-height: 1.6;
}

/* Page Container */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-container h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #00D664;
}

/* About Page */
.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat {
  text-align: center;
  padding: 1.5rem;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid rgba(0, 214, 100, 0.2);
}

.stat h3 {
  font-size: 2rem;
  color: #00D664;
  margin-bottom: 0.5rem;
}

.stat p {
  color: #a0a0a0;
}

/* Contact Page */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid rgba(0, 214, 100, 0.2);
}

.contact-item i {
  font-size: 1.5rem;
  color: #00D664;
  margin-top: 0.25rem;
}

.contact-item h3 {
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.contact-item p {
  color: #a0a0a0;
  line-height: 1.6;
}

.contact-form {
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 214, 100, 0.2);
}

.contact-form h3 {
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.contact-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.875rem;
  border: 2px solid #333333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #ffffff;
  font-size: 1rem;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #666666;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.2);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 214, 100, 0.4);
}

/* Footer */
.app-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  padding: 2.5rem 0 1rem;
  border-top: 1px solid #333333;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.footer-section h3 {
  color: #00D664;
  font-weight: 700;
}

.footer-section p,
.footer-section li {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #00D664;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #333333;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background-color: #00D664;
  transform: translateY(-2px);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem 0;
  border-top: 1px solid #333333;
  text-align: center;
}

.footer-bottom p {
  color: #808080;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-actions {
    gap: 0.5rem;
  }

  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-stats {
    flex-direction: row;
    justify-content: space-around;
  }

  .page-container {
    padding: 2rem 1rem;
  }

  .page-container h1 {
    font-size: 2rem;
  }
}
</style>