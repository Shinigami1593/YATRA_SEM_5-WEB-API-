<template>
  <div class="signin-page">
    <div class="signin-container">
      <!-- Left Side - Branding -->
      <div class="signin-left">
        <div class="brand-section">
          <div class="brand-logo">
            <i class="bi bi-compass"></i>
          </div>
          <h1 class="brand-title">Yatra</h1>
          <p class="brand-subtitle">Your journey starts here</p>
        </div>
        
        <div class="features-section">
          <div class="feature-item">
            <i class="bi bi-geo-alt-fill"></i>
            <div>
              <h3>Smart Navigation</h3>
              <p>Get real-time directions and route optimization</p>
            </div>
          </div>
          <div class="feature-item">
            <i class="bi bi-clock-fill"></i>
            <div>
              <h3>Live Updates</h3>
              <p>Stay informed with real-time transit information</p>
            </div>
          </div>
          <div class="feature-item">
            <i class="bi bi-shield-check-fill"></i>
            <div>
              <h3>Secure & Reliable</h3>
              <p>Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
        
        <div class="testimonial">
          <blockquote>
            "Yatra has completely transformed how I navigate the city. It's intuitive, fast, and incredibly reliable."
          </blockquote>
          <cite>- Sarah Chen, Toronto</cite>
        </div>
      </div>

      <!-- Right Side - Sign In Form -->
      <div class="signin-right">
        <div class="form-container">
          <div class="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your Yatra account</p>
          </div>

          <form @submit.prevent="handleSignIn" class="signin-form">
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

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="formData.rememberMe">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
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
              <span>or continue with</span>
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
              <a href="#" @click.prevent="switchToSignup" class="signup-link-btn">
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Emits
const emit = defineEmits(['switch-to-signup', 'login'])

// Reactive data
const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({})
const isLoading = ref(false)
const showPassword = ref(false)

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }
  
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSignIn = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful login
    const userData = {
      id: 1,
      name: 'John Doe',
      email: formData.value.email
    }
    
    const token = 'mock-jwt-token-' + Date.now()
    
    // Emit login event
    emit('login', userData, token)
    
    alert('Sign in successful!')
  } catch (error) {
    errors.value.general = 'Sign in failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const switchToSignup = () => {
  emit('switch-to-signup')
}

// Lifecycle
onMounted(() => {
  // Load Bootstrap Icons if not already loaded
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
    document.head.appendChild(link)
  }
})
</script>

<style scoped>
.signin-page {
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

.signin-container {
  width: 100%;
  max-width: none;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

/* Left Side - Branding */
.signin-left {
  background: linear-gradient(135deg, #00D664 0%, #00C956 50%, #00B84A 100%);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  position: relative;
  overflow: hidden;
}

.signin-left::before {
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

.features-section {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-item i {
  font-size: 1.5rem;
  color: white;
  margin-top: 0.25rem;
}

.feature-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.feature-item p {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.5;
}

.testimonial {
  position: relative;
  z-index: 2;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.testimonial blockquote {
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.testimonial cite {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Right Side - Form */
.signin-right {
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
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

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 1rem;
  border: 2px solid #333333;
  border-radius: 12px;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 1rem;
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

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.checkbox-container input {
  width: auto;
  margin: 0;
}

.forgot-password {
  color: #00D664;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #00C956;
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
  transition: all 0.3s ease;
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
  margin: 1.5rem 0;
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

.signup-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #333333;
}

.signup-link p {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.signup-link-btn {
  color: #00D664;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link-btn:hover {
  color: #00C956;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .signin-container {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }
  
  .signin-left {
    display: none;
  }
  
  .signin-right {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .signin-page {
    padding: 1rem;
  }
  
  .signin-right {
    padding: 1.5rem;
  }
  
  .form-container {
    max-width: none;
  }
  
  .form-header h2 {
    font-size: 1.75rem;
  }
  
  .social-signin {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .signin-page {
    padding: 0.5rem;
  }
  
  .signin-right {
    padding: 1rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>