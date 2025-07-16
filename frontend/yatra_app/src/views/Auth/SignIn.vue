<template>
  <div class="signin-page">
    <div class="signin-container">
      <div class="form-container">
        <div class="form-header">
          <h2>Sign In</h2>
          <p>Welcome back to Yatra</p>
        </div>

        <form @submit.prevent="handleSignIn" class="signin-form">
          <div v-if="loginError" class="error-message">{{ loginError }}</div>

          <div class="form-group">
            <label for="email">
              <i class="bi bi-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              style="width: 355px;"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
              :class="{ 'error': errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="bi bi-lock"></i>
              Password
            </label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="formData.password"
                style="width: 321px;"
                placeholder="Enter your password"
                required
                :class="{ 'error': errors.password }"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          <button type="submit" class="signin-btn" :disabled="isLoading">
            <span v-if="!isLoading">
              <i class="bi bi-box-arrow-in-right"></i>
              Sign In
            </span>
            <span v-else class="loading-text">
              <i class="bi bi-hourglass-split loading-icon"></i>
              Signing in...
            </span>
          </button>

          <div class="divider">
            <span>or sign in with</span>
          </div>

          <div class="social-signin">
            <button type="button" class="social-btn google-btn">
              <i class="bi bi-google"></i>
              Google
            </button>
            <button type="button" class="social-btn apple-btn">
              <i class="bi bi-apple"></i>
              Apple
            </button>
          </div>
        </form>

        <div class="signup-link">
          <p>Don't have an account? 
            <router-link to="/register" class="signup-link-btn">
              Sign up here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Signin.vue <script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';
import { adminApiClient, userApiClient } from '@/services/axios'; // Correct import

const formData = ref({
  email: '',
  password: '',
});
const errors = ref({});
const showPassword = ref(false);
const isLoading = ref(false);
const loginError = ref('');

const router = useRouter();
const authStore = useAuthStore();

const validateForm = () => {
  errors.value = {};

  if (!formData.value.email) {
    errors.value.email = 'Email is required';
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required';
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }

  return Object.keys(errors.value).length === 0;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSignIn = async () => {
  loginError.value = '';

  if (!validateForm()) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    let response;

    // 1. Try Admin Login First
    try {
      response = await adminApiClient.post('/login', {
        email: formData.value.email,
        password: formData.value.password,
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Invalid credentials'
      ) {
        // 2. Try User Login
        response = await userApiClient.post('/login', {
          email: formData.value.email.toLowerCase(),
          password: formData.value.password,
        });
      } else {
        throw error; // Rethrow other errors
      }
    }

    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server. Expected token and user.');
    }

    // Save to store (use Pinia action instead of direct assignment)
    await authStore.login({
      email: formData.value.email,
      password: formData.value.password,
    });

    // Redirect based on role
    const role = authStore.getRole;
    console.log('Role after login:', role); // Debug role
    if (['admin', 'superadmin', 'moderator'].includes(role)) {
      console.log('Redirecting to /admin'); // Debug
      router.push('/admin');
    } else {
      console.log('Redirecting to /home'); // Debug
      router.push('/home');
    }
  } catch (error) {
    console.error('Login Error:', error);
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        loginError.value = data.message || 'Invalid credentials.';
      } else {
        loginError.value = `Server error (Status: ${status}).`;
      }
    } else {
      loginError.value = error.message || 'Network error.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    const role = authStore.getRole;
    console.log('onMounted - Role:', role); // Debug
    if (['admin', 'superadmin', 'moderator'].includes(role)) {
      console.log('onMounted - Redirecting to /admin'); // Debug
      router.push('/admin');
    } else {
      console.log('onMounted - Redirecting to /home'); // Debug
      router.push('/home');
    }
  }
  errors.value = {};
  loginError.value = '';
});
</script>


<style scoped>
.signin-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.signin-container {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.form-container {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.form-header p {
  color: #a0a0a0;
  font-size: 1rem;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #ffffff;
  font-size: 0.9rem;
}

.form-group label i {
  color: #00D664;
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #333333;
  border-radius: 12px;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 0.95rem;
}

.form-group input::placeholder {
  color: #666666;
}

.form-group input:focus {
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.2);
}

.form-group input.error {
  border-color: #ef4444;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  font-size: 1.1rem;
}

.password-toggle:hover {
  color: #00D664;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.general-error {
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.signin-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.signin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 214, 100, 0.4);
}

.signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 1.25rem 0;
  position: relative;
  color: #666666;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #333333;
  z-index: 1;
}

.divider span {
  background: #1a1a1a;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-signin {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  padding: 0.875rem;
  border: 2px solid #333333;
  border-radius: 12px;
  background: #2a2a2a;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-btn:hover {
  border-color: #00D664;
  background: #333333;
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
}

.signup-link p {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.signup-link-btn {
  color: #00D664;
  text-decoration: none;
  font-weight: 600;
}

.signup-link-btn:hover {
  color: #00C956;
}
</style>