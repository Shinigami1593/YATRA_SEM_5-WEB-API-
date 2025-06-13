<template>
  <div class="signin-page">
    <div class="signin-container">
      <div class="form-container">
        <div class="form-header">
          <h2>Sign In</h2>
          <p>Welcome back to Yatra</p>
        </div>

        <form @submit.prevent="handleSignIn" class="signin-form">
          <div v-if="errors.general" class="error-message general-error">{{ errors.general }}</div>

          <div class="form-group">
            <label for="email">
              <i class="bi bi-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
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

<script>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';
import apiClient from '@/services/axios';

export default {
    name: 'LoginPage',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            errors: {},
            showPassword: false,
            rememberMe: false,
            isLoading: false,
            loginError: ''
        }
    },
    methods: {
        validateForm() {
            this.errors = {};

            // Email validation
            if (!this.formData.email) {
                this.errors.email = 'Email is required';
            } else if (!this.isValidEmail(this.formData.email)) {
                this.errors.email = 'Please enter a valid email address';
            }

            // Password validation
            if (!this.formData.password) {
                this.errors.password = 'Password is required';
            } else if (this.formData.password.length < 8) {
                this.errors.password = 'Password must be at least 8 characters';
            }

            return Object.keys(this.errors).length === 0;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },

        async handleLogin() {
            this.loginError = '';

            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;

            try {
                const response = await this.authenticateUser(this.formData);

                // Check if user has admin role
                if (response.user.role !== 'admin') {
                    throw new Error('Only admins can log in.');
                }

                // Update Pinia store with auth data
                const authStore = useAuthStore();
                authStore.setAuthData({
                    token: response.token,
                    user: response.user,
                    rememberMe: this.rememberMe
                });

                // Emit login success event
                this.$emit('login-success', {
                    email: this.formData.email,
                    rememberMe: this.rememberMe,
                    user: response.user
                });

                // Redirect to dashboard
                this.$router.push('/home');

            } catch (error) {
                // Handle specific errors
                if (error.message === 'Only admins can log in.') {
                    this.loginError = 'Only administrators are allowed to log in.';
                } else if (error.response && error.response.data && error.response.data.message) {
                    const message = error.response.data.message;
                    if (message === 'Invalid credentials') {
                        this.loginError = 'Incorrect email or password. Please try again.';
                    } else {
                        this.loginError = message;
                    }
                } else {
                    this.loginError = 'An error occurred. Please try again later.';
                }
            } finally {
                this.isLoading = false;
            }
        },

        async authenticateUser(credentials) {
            const response = await apiClient.post('/login', {
                email: credentials.email,
                password: credentials.password
            });
            return response.data; // { message, token, user }
        }
    },

    mounted() {
        // Clear any existing errors when component mounts
        this.errors = {};
        this.loginError = '';

        // Check if user is authenticated and redirect if logged in
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
            this.$router.push('/');
        }
    }
}
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