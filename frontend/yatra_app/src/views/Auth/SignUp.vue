<template>
  <div class="signup-page">
    <div class="signup-container">
      <!-- Left Side - Branding -->
      <div class="signup-left">
        <div class="brand-section">
          <div class="brand-logo">
            <i class="bi bi-compass"></i>
          </div>
          <h1 class="brand-title">Join Yatra</h1>
          <p class="brand-subtitle">Start your journey with us today</p>
        </div>
        
        <div class="benefits-section">
          <h3>Why choose Yatra?</h3>
          <div class="benefit-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>Free to use with premium features</span>
          </div>
          <div class="benefit-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>Real-time transit updates</span>
          </div>
          <div class="benefit-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>Personalized route recommendations</span>
          </div>
          <div class="benefit-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>Offline maps and navigation</span>
          </div>
          <div class="benefit-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>Community-driven updates</span>
          </div>
        </div>
        
        <div class="stats-section">
          <div class="stat">
            <h4>10K+</h4>
            <p>Happy Users</p>
          </div>
          <div class="stat">
            <h4>50+</h4>
            <p>Cities</p>
          </div>
          <div class="stat">
            <h4>99.9%</h4>
            <p>Uptime</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Sign Up Form -->
      <div class="signup-right">
        <div class="form-container">
          <div class="form-header">
            <h2>Create Account</h2>
            <p>Join thousands of users who trust Yatra</p>
          </div>

          <form @submit.prevent="handleSignup" class="signup-form">
            <div v-if="errors.general" class="error-message general-error">{{ errors.general }}</div>
            <div class="name-group">
              <div class="form-group">
                <label for="firstName">
                  <i class="bi bi-person"></i>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  style="width: auto;"
                  v-model="formData.firstName"
                  placeholder="Enter first name"
                  required
                  :class="{ 'error': errors.firstName }"
                />
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              </div>
              
              <div class="form-group">
                <label for="lastName">
                  <i class="bi bi-person"></i>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  style="width: auto;"
                  v-model="formData.lastName"
                  placeholder="Enter last name"
                  required
                  :class="{ 'error': errors.lastName }"
                />
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">
                <i class="bi bi-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                style="width: 420px;"
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
                  style="width: 388px;"
                  v-model="formData.password"
                  placeholder="Create a strong password"
                  required
                  :class="{ 'error': errors.password }"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"> </i>
                </button>
              </div>
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
                </div>
                <span class="strength-text" :class="passwordStrength.class">{{ passwordStrength.text }}</span>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <div class="form-group">
              <label for="confirmPassword">
                <i class="bi bi-lock-fill"></i>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                style="width: 420px;"
                v-model="formData.confirmPassword"
                placeholder="Confirm your password"
                required
                :class="{ 'error': errors.confirmPassword }"
              />
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="formData.agreeToTerms" required>
                <span class="checkmark"></span>
                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" class="signup-btn" :disabled="isLoading || !formData.agreeToTerms">
              <span v-if="!isLoading">
                <i class="bi bi-person-plus"></i>
                Create Account
              </span>
              <span v-else class="loading-text">
                <i class="bi bi-hourglass-split loading-icon"></i>
                Creating account...
              </span>
            </button>

            <div class="divider">
              <span>or sign up with</span>
            </div>

            <div class="social-signup">
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

          <div class="signin-link">
            <p>Already have an account? 
              <router-link to="/login" class="signin-link-btn">
                Sign in here
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';
import apiClient from '@/services/axios';
import { RouterLink } from 'vue-router';

// Define custom events
const emit = defineEmits(['signup-success']);

// Reactive state
const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const errors = ref({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeToTerms = ref(false);
const subscribeNewsletter = ref(false);
const isLoading = ref(false);
const signupError = ref('');
const signupSuccess = ref('');

const router = useRouter();
const authStore = useAuthStore();

// Computed properties
const passwordStrength = computed(() => {
    const password = formData.value.password;
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return Math.min(strength, 5);
});

const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 1) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
});

const passwordStrengthWidth = computed(() => {
    return `${(passwordStrength.value / 5) * 100}%`;
});

const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value;
    if (!formData.value.password) return '';
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
});

// Methods
const validateForm = () => {
    errors.value = {};

    // First name validation
    if (!formData.value.firstName.trim()) {
        errors.value.firstName = 'First name is required';
    } else if (formData.value.firstName.trim().length < 2) {
        errors.value.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.value.lastName.trim()) {
        errors.value.lastName = 'Last name is required';
    } else if (formData.value.lastName.trim().length < 2) {
        errors.value.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.value.email) {
        errors.value.email = 'Email is required';
    } else if (!isValidEmail(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }


    // Password validation
    if (!formData.value.password) {
        errors.value.password = 'Password is required';
    } else if (formData.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.value < 3) {
        errors.value.password = 'Password is too weak. Use a mix of letters, numbers, and symbols';
    }

    // Confirm password validation
    if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password';
    } else if (formData.value.password !== formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!agreeToTerms.value) {
        errors.value.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    return Object.keys(errors.value).length === 0;
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSignup = async () => {
    signupError.value = '';
    signupSuccess.value = '';

    if (!validateForm()) {
        return;
    }

    isLoading.value = true;

    try {
        const response = await registerUser({
            name: formData.value.firstName + formData.value.lastName,
            email: formData.value.email,
            password: formData.value.password,
        });

        console.log('Signup response:', {
            status: response.status,
            data: response.data,
        });

        // Verify response structure
        if (!response.data || !response.data.token || !response.data.user) {
            throw new Error('Invalid response structure from server');
        }

        // Update Pinia store with auth data
        authStore.setAuthData({
            token: response.data.token,
            user: response.data.user,
            rememberMe: true,
        });

        // Emit signup success event
        emit('signup-success', {
            email: formData.value.email,
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
        });

        // Set success message
        signupSuccess.value = 'Account created successfully! Redirecting to dashboard...';

        // Reset form and redirect after a brief delay
        setTimeout(() => {
            resetForm();
            router.push('/login');
        }, 2000);
    } catch (error) {
        console.error('Signup error:', {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    data: error.response.data,
                }
                : null,
        });

        // Handle backend errors
        if (error.response && error.response.data) {
            const { message, errors } = error.response.data;
            if (message === 'User already exists') {
                signupError.value = 'An account with this email already exists.';
            } else if (errors && Array.isArray(errors)) {
                errors.forEach((err) => {
                    errors.value[err.param] = err.msg;
                });
                signupError.value = 'Please correct the errors in the form.';
            } else if (message) {
                signupError.value = message;
            } else {
                signupError.value = 'Registration failed. Please try again later.';
            }
        } else {
            signupError.value = error.message || 'Network error. Please check your connection and try again.';
        }
    } finally {
        isLoading.value = false;
    }
};

const registerUser = async (userData) => {
    const response = await apiClient.post('/register', userData);
    console.log('Raw Axios response:', response);
    return {
        status: response.status,
        data: response.data,
    };
};

const resetForm = () => {
    formData.value = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    agreeToTerms.value = false;
    subscribeNewsletter.value = false;
    errors.value = {};
    signupError.value = '';
    signupSuccess.value = '';
};

// Check authentication status on mount
onMounted(() => {
    if (authStore.isAuthenticated) {
        const user = authStore.getUser;
        if (user && user.role === 'admin') {
            router.push('/home'); // Admin already logged in, redirect to dashboard
        } else {
            authStore.logout(); // Non-admin (e.g., driver), log out and redirect to login
            router.push('/login');
        }
    }
});

// Lifecycle hook equivalent
resetForm();
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}

.signup-container {
  width: 100%;
  max-width: none;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.signup-left {
  background: linear-gradient(135deg, #00D664 0%, #0c7038 50%, #00B84A 100%);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  position: relative;
  overflow: hidden;
}

.signup-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.brand-section {
  position: relative;
  z-index: 2;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-logo i {
  font-size: 2.5rem;
  color: white;
}

.brand-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
}

.brand-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.benefits-section {
  position: relative;
  z-index: 2;
}

.benefits-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.benefit-item i {
  color: white;
  font-size: 1.2rem;
}

.stats-section {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  text-align: center;
}

.stat h4 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: white;
}

.stat p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.signup-right {
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #a0a0a0;
  font-size: 1rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.name-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #333333;
  border-radius: 12px;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #666666;
}

.form-group input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.2);
}

.form-group input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.password-input {
  position: relative;
  width: 100%;
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
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #00D664;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #333333;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }
.strength-fill.very-strong { background: #00D664; }

.strength-text {
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 80px;
}

.strength-text.weak { color: #ef4444; }
.strength-text.fair { color: #f59e0b; }
.strength-text.good { color: #3b82f6; }
.strength-text.strong { color: #10b981; }
.strength-text.very-strong { color: #00D664; }

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #a0a0a0;
  font-size: 0.85rem;
  line-height: 1.4;
}

.checkbox-container input {
  width: auto;
  margin: 0;
  margin-top: 0.1rem;
}

.terms-link {
  color: #00D664;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: #00C956;
  text-decoration: underline;
}

.signup-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #00D664 0%, #00C956 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.signup-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 214, 100, 0.4);
}

.signup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
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

.social-signup {
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-btn:hover {
  border-color: #00D664;
  background: #333333;
}

.signin-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
}

.signin-link p {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.signin-link-btn {
  color: #00D664;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signin-link-btn:hover {
  color: #00C956;
}

@media (max-width: 1024px) {
  .signup-container {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }
  
  .signup-left {
    display: none;
  }
  
  .signup-right {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .signup-page {
    padding: 1rem;
  }
  
  .signup-right {
    padding: 1.5rem;
  }
  
  .form-container {
    max-width: none;
  }
  
  .form-header h2 {
    font-size: 1.75rem;
  }
  
  .name-group {
    grid-template-columns: 1fr;
  }
  
  .social-signup {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .signup-page {
    padding: 0.5rem;
  }
  
  .signup-right {
    padding: 1rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 0.75rem;
  }
}
</style>