<template>
  <div class="add-user-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div class="header-info">
          <h1>Add New User</h1>
          <p>Create a new user account for the Yatra platform</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="user-form">
        <!-- Profile Picture Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-person-circle"></i>
            <h2>Profile Picture</h2>
          </div>
          
          <div class="profile-upload-container">
            <div class="profile-preview">
              <img 
                v-if="profilePreview" 
                :src="profilePreview" 
                alt="Profile Preview"
                class="profile-image"
              >
              <div v-else class="profile-placeholder">
                <i class="bi bi-person-fill"></i>
                <span>No Image</span>
              </div>
            </div>
            
            <div class="upload-controls">
              <input 
                type="file" 
                id="profilePicture" 
                @change="handleFileUpload"
                accept="image/*"
                class="file-input"
              >
              <label for="profilePicture" class="upload-btn">
                <i class="bi bi-cloud-upload"></i>
                Choose Profile Picture
              </label>
              <button 
                v-if="profilePreview" 
                type="button" 
                class="remove-btn"
                @click="removeProfilePicture"
              >
                <i class="bi bi-trash"></i>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-person-fill"></i>
            <h2>Personal Information</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name"
                :class="{ 'error': errors.name }"
                placeholder="Enter full name"
                required
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="formData.firstName"
                :class="{ 'error': errors.firstName }"
                placeholder="Enter first name"
                required
              >
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="formData.lastName"
                :class="{ 'error': errors.lastName }"
                placeholder="Enter last name"
                required
              >
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
                :class="{ 'error': errors.email }"
                placeholder="user@example.com"
                required
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
          </div>
        </div>

        <!-- Account Settings Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-gear-fill"></i>
            <h2>Account Settings</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="password">Password *</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password" 
                  v-model="formData.password"
                  :class="{ 'error': errors.password }"
                  placeholder="Enter password"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePasswordVisibility"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              <p class="help-text">Password must be at least 6 characters long</p>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password *</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="formData.confirmPassword"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Confirm password"
                required
              >
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div class="form-group">
              <label for="role">User Role</label>
              <select id="role" v-model="formData.role" disabled>
                <option value="user">User</option>
              </select>
              <p class="help-text">Currently only 'user' role is supported</p>
            </div>
          </div>
        </div>

        <!-- Account Summary -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-info-circle"></i>
            <h2>Account Summary</h2>
          </div>
          
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Full Name</div>
              <div class="summary-value">{{ formData.name || 'Not provided' }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">First Name</div>
              <div class="summary-value">{{ formData.firstName || 'Not provided' }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">Last Name</div>
              <div class="summary-value">{{ formData.lastName || 'Not provided' }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">Email</div>
              <div class="summary-value">{{ formData.email || 'Not provided' }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">Role</div>
              <div class="summary-value">{{ formData.role }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">Profile Picture</div>
              <div class="summary-value">{{ formData.profilePicture ? 'Uploaded' : 'Not uploaded' }}</div>
            </div>
            
            <div class="summary-item">
              <div class="summary-label">Account Creation</div>
              <div class="summary-value">{{ new Date().toLocaleDateString() }} (Today)</div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="resetForm">
            <i class="bi bi-arrow-clockwise"></i>
            Reset Form
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <i class="bi bi-check-circle" v-if="!isLoading"></i>
            <i class="bi bi-hourglass-split spinning" v-else></i>
            {{ isLoading ? 'Creating User...' : 'Create User' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';
import apiClient from '@/services/axios'; // Align with working script

const isLoading = ref(false);
const showPassword = ref(false);
const profilePreview = ref(null);

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'user', // Default and only allowed role
  confirmPassword: '', // For validation only
  profilePicture: null // Will store the file or base64 string
});

const errors = ref({});

// Computed properties (optional password strength, simplified)
const passwordStrength = computed(() => {
  const password = formData.password;
  if (!password) return { class: '', width: '0%', text: '' };
  const strength = password.length >= 6 ? (password.length >= 8 ? 'strong' : 'medium') : 'weak';
  return { class: strength, width: `${Math.min(password.length / 12 * 100, 100)}%`, text: strength.charAt(0).toUpperCase() + strength.slice(1) };
});

// Methods
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.value = e.target.result;
      formData.profilePicture = e.target.result; // Store base64 string
    };
    reader.readAsDataURL(file);
  }
};

const removeProfilePicture = () => {
  profilePreview.value = null;
  formData.profilePicture = null;
  document.getElementById('profilePicture').value = '';
};

const validateForm = () => {
  errors.value = {};

  if (!formData.name.trim()) errors.value.name = 'Full name is required';
  else if (formData.name.trim().length < 2) errors.value.name = 'Full name must be at least 2 characters';

  if (!formData.firstName.trim()) errors.value.firstName = 'First name is required';
  else if (formData.firstName.trim().length < 2) errors.value.firstName = 'First name must be at least 2 characters';

  if (!formData.lastName.trim()) errors.value.lastName = 'Last name is required';
  else if (formData.lastName.trim().length < 2) errors.value.lastName = 'Last name must be at least 2 characters';

  if (!formData.email) errors.value.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.value.email = 'Please enter a valid email address';

  if (!formData.password) errors.value.password = 'Password is required';
  else if (formData.password.length < 6) errors.value.password = 'Password must be at least 6 characters';
  else if (passwordStrength.value.class === 'weak') errors.value.password = 'Password is too weak. Use more characters or variety';

  if (!formData.confirmPassword) errors.value.confirmPassword = 'Please confirm your password';
  else if (formData.password !== formData.confirmPassword) errors.value.confirmPassword = 'Passwords do not match';

  console.log('Validation errors:', errors.value);
  return Object.keys(errors.value).length === 0;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const submitForm = async () => {
  console.log('Create User button pressed, initiating submitForm');
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`, // Match working script
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    };

    console.log('Full API URL:', apiClient.getUri({ url: '/signup' }));
    console.log('Sending user data to API:', userData);
    const response = await apiClient.post('/signup', userData);

    console.log('Signup response:', {
      status: response.status,
      data: response.data,
    });

    if (!response.data || !response.data.token || !response.data.user) {
      throw new Error('Invalid response structure from server');
    }

    // Update auth store (optional for admin adding user)
    authStore.register({
      token: response.data.token,
      user: response.data.user,
      rememberMe: true,
    });

    // Success message and redirect
    alert('User created successfully!');
    setTimeout(() => {
      router.push('/admin');
      resetForm();
    }, 2000);
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });

    if (error.response && error.response.data) {
      const { message, errors } = error.response.data;
      if (message === 'Email already in use') signupError.value = 'An account with this email already exists.';
      else if (errors && Array.isArray(errors)) {
        errors.forEach((err) => errors.value[err.param] = err.msg);
        signupError.value = 'Please correct the errors in the form.';
      } else if (message) signupError.value = message;
      else signupError.value = 'Registration failed. Please try again later.';
    } else signupError.value = error.message || 'Network error. Please check your connection and try again.';
    alert('Error creating user: ' + signupError.value);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  formData.name = '';
  formData.email = '';
  formData.password = '';
  formData.firstName = '';
  formData.lastName = '';
  formData.role = 'user';
  formData.confirmPassword = '';
  formData.profilePicture = null;
  profilePreview.value = null;
  document.getElementById('profilePicture').value = '';
  errors.value = {};
};

const goBack = () => {
  router.push('/admin');
};
</script>

<style scoped>
.add-user-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 1px solid #333333;
  padding: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: #333333;
  border: 1px solid #555555;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #444444;
}

.header-info h1 {
  color: #00D664;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.header-info p {
  color: #a0a0a0;
  margin: 0;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
}

.section-header i {
  color: #00D664;
  font-size: 1.2rem;
}

.section-header h2 {
  color: #ffffff;
  margin: 0;
  font-size: 1.3rem;
}

.profile-upload-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666666;
  font-size: 0.85rem;
}

.profile-placeholder i {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #00D664;
  color: #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  justify-content: center;
}

.upload-btn:hover {
  background: #00b854;
}

.remove-btn {
  background: #e74c3c;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  justify-content: center;
}

.remove-btn:hover {
  background: #c0392b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #00D664;
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
}

.form-group select:disabled {
  background: #2a2a2a;
  color: #666666;
  cursor: not-allowed;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #ffffff;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.help-text {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  padding: 1rem;
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
}

.summary-label {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.summary-value {
  color: #ffffff;
  font-size: 0.95rem;
  word-break: break-word;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #333333;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: #00D664;
  color: #000000;
}

.btn-secondary {
  background: #333333;
  color: #ffffff;
  border: 1px solid #555555;
}

.btn-primary:hover {
  background: #00b854;
}

.btn-secondary:hover {
  background: #444444;
}

.btn-primary:disabled {
  background: #666666;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header,
  .form-container {
    padding: 1rem;
  }

  .form-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .profile-upload-container {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .header-info h1 {
    font-size: 1.5rem;
  }
}
</style>