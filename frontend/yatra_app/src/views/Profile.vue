<template>
  <div class="profile-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="profile-container">
        <!-- Profile Picture Section -->
        <div class="profile-picture-section">
          <div class="picture-container">
            <div class="profile-picture">
              <img 
                v-if="profileData.profilePicture" 
                :src="getBackendImageUrl(profileData.profilePicture)" 
                :alt="defaultAvatar"
                class="profile-img"
              >
              <div v-else class="profile-placeholder">
                <img class="dummy-img" src="https://avatar.iran.liara.run/public/boy" alt="p">
              </div>
              
              <!-- Upload Overlay -->
              <div class="upload-overlay" @click="triggerFileUpload">
                <i class="bi bi-camera"></i>
                <span>Change Photo</span>
              </div>
            </div>
            
            <!-- Hidden File Input -->
            <input 
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="onFileSelected"
              style="display: none"
            >
            
            <!-- Upload Actions -->
            <div v-if="selectedFile" class="upload-actions">
              <button class="action-btn secondary" @click="cancelUpload">
                <i class="bi bi-x"></i>
                Cancel
              </button>
              <button class="action-btn primary" @click="uploadProfilePicture" :disabled="uploading">
                <i class="bi bi-upload" :class="{ 'spinning': uploading }"></i>
                {{ uploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
          </div>
          
          <div class="picture-info">
            <h3>{{ profileData.firstName }} {{ profileData.lastName }}</h3>
            <p class="user-email">{{ profileData.email }}</p>
            <div class="user-meta">
              <span class="meta-item">
                <i class="bi bi-calendar"></i>
                Member since {{ formatDate(profileData.createdAt) }}
              </span>
              <span class="meta-item">
                <i class="bi bi-shield-check"></i>
                {{ capitalizeRole(profileData.role) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Form Section -->
        <div class="profile-form-section">
          <div class="form-header">
            <h2>Profile Information</h2>
            <div class="form-actions">
              <button 
                v-if="isEditing" 
                class="action-btn secondary" 
                @click="cancelEdit"
              >
                <i class="bi bi-x"></i>
                Cancel
              </button>
              <button 
                v-if="!isEditing" 
                class="action-btn primary" 
                @click="startEdit"
              >
                <i class="bi bi-pencil"></i>
                Edit Profile
              </button>
              <button 
                v-if="isEditing" 
                class="action-btn primary" 
                @click="saveProfile"
                :disabled="saving || !hasChanges"
              >
                <i class="bi bi-check" :class="{ 'spinning': saving }"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

          <form @submit.prevent="saveProfile" class="profile-form">
            <!-- Personal Information -->
            <div class="form-section">
              <h3 class="section-title">Personal Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    id="firstName"
                    v-model="editData.firstName"
                    type="text"
                    :disabled="!isEditing"
                    :class="{ 'error': errors.firstName }"
                    class="form-input"
                    required
                  >
                  <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
                </div>
                
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    id="lastName"
                    v-model="editData.lastName"
                    type="text"
                    :disabled="!isEditing"
                    :class="{ 'error': errors.lastName }"
                    class="form-input"
                    required
                  >
                  <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
                </div>
              </div>
              <br>
              <div class="form-group">
                <label for="name">Display Name</label>
                <input
                  id="name"
                  v-model="editData.name"
                  type="text"
                  :disabled="!isEditing"
                  :class="{ 'error': errors.name }"
                  class="form-input"
                  required
                >
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="form-section">
              <h3 class="section-title">Contact Information</h3>
              
              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  id="email"
                  v-model="editData.email"
                  type="email"
                  :disabled="!isEditing"
                  :class="{ 'error': errors.email }"
                  class="form-input"
                  required
                >
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                <small class="form-help">Your email address is used for account verification and notifications</small>
              </div>
            </div>

            <!-- Account Security -->
            <div class="form-section">
              <!-- <h3 class="section-title">Account Security</h3>
              
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">Password</div>
                  <div class="security-description">Last updated </div> 
                </div>
                <button type="button" class="action-btn secondary" @click="showChangePassword">
                  <i class="bi bi-key"></i>
                  Change Password
                </button>
              </div> -->
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    

    <!-- Success/Error Messages -->
    <!-- <div v-if="message" class="message-toast" :class="messageType">
      <i :class="messageType === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
      <span>{{ message }}</span>
      <button @click="clearMessage" class="close-message">
        <i class="bi bi-x"></i>
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,computed } from 'vue'
import { getBackendImageUrl } from '@/utils/imageHelpers'
import axios from '@/services/axios'

const count = ref(0)
const double = computed(() => count.value * 2)

const profileData = reactive({
  firstName: '',
  lastName: '',
  name: '',
  email: '',
  profilePicture: '',
  createdAt: '',
  role: ''
})

const editData = reactive({
  firstName: '',
  lastName: '',
  name: '',
  email: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  name: '',
  email: ''
})

// Example image path you get from backend (simulate)
// Call the function and log the result
// console.log('Full image URL:', getBackendImageUrl(ImagePath));

const hasChanges = computed(() => {
  return JSON.stringify(editData) !== JSON.stringify(profileData)
})

const defaultAvatar = "https://avatar.iran.liara.run/public/boy"
const selectedFile = ref(null)
const previewImage = ref(null)
const isEditing = ref(false)
const saving = ref(false)
const fileInput = ref(null)

const profileImageUrl = computed(() => {
  return previewImage.value || getBackendImageUrl(profileData.profilePicture);
});

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const uploading = ref(false)

const uploadProfilePicture = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('profilePicture', selectedFile.value)

    const res = await axios.userApiClient.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    Object.assign(profileData, res.data.user)
    Object.assign(editData, res.data.user)
    previewImage.value = profileData.profilePicture
    selectedFile.value = null
    alert('Profile picture updated successfully!')
  } catch (error) {
    console.error('Failed to upload profile picture:', error)
    alert(error.response?.data?.message || 'Failed to upload profile picture')
  } finally {
    uploading.value = false
  }
}


const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const capitalizeRole = (role) => {
  if (!role) return ''
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const loadProfile = async () => {
  try {
    const res = await axios.userApiClient.get('/profile')
    Object.assign(profileData, res.data)
    Object.assign(editData, res.data)
    previewImage.value = profileData.profilePicture
    
    console.log(profileData.profilePicture)// URL string or null
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}


const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Only image files are allowed.')
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    alert('File size must be under 5MB.')
    return
  }

  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const cancelUpload = () => {
  selectedFile.value = null
  previewImage.value = profileData.profilePicture || null
  if (fileInputRef.value) {
    fileInputRef.value.value = null
  }
}

const validateForm = () => {
  errors.firstName = editData.firstName.trim() ? '' : 'First name is required'
  errors.lastName = editData.lastName.trim() ? '' : 'Last name is required'
  errors.name = editData.name.trim() ? '' : 'Display name is required'
  errors.email = /^\S+@\S+\.\S+$/.test(editData.email) ? '' : 'Valid email is required'

  return !Object.values(errors).some(msg => msg)
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(editData, profileData)
  errors.firstName = ''
  errors.lastName = ''
  errors.name = ''
  errors.email = ''
  cancelUpload() // reset file selection
}

const saveProfile = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    const formData = new FormData()
    formData.append('firstName', editData.firstName)
    formData.append('lastName', editData.lastName)
    formData.append('name', editData.name)
    formData.append('email', editData.email)
    if (selectedFile.value) {
      formData.append('profilePicture', selectedFile.value)
    }

    const res = await axios.userApiClient.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    Object.assign(profileData, res.data.user)
    Object.assign(editData, res.data.user)
    previewImage.value = profileData.profilePicture
    selectedFile.value = null
    alert('Profile updated successfully!')
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert(error.response?.data?.message || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>



<style scoped>
.profile-page {
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
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-info h1 {
  color: #00D664;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.header-info p {
  color: #a0a0a0;
  margin: 0;
  font-size: 1.1rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
}

/* Profile Picture Section */
.profile-picture-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  height: fit-content;
}

.picture-container {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-picture {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-picture:hover .upload-overlay {
  opacity: 1;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* .dummy-img{
  width: 190px;
  height: 190px;
  display: flex;
  
  
justify-content: center;
  align-items: center
  ;
} */

.profile-placeholder {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #333333 0%, #444444 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
}

.profile-placeholder i {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.profile-placeholder span {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #ffffff;
  cursor: pointer;
  border-radius: 50%;
}

.upload-overlay:hover {
  background: rgba(0, 0, 0, 0.8);
}

.upload-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #00D664;
}

.upload-overlay span {
  font-size: 0.9rem;
  font-weight: 600;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.picture-info {
  text-align: center;
}

.picture-info h3 {
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.user-email {
  color: #00D664;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.meta-item i {
  color: #00D664;
}

/* Profile Form Section */
.profile-form-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
}

.form-header h2 {
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #333333;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  color: #00D664;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
}

.form-row {
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
  color: #ffffff;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 2px rgba(0, 214, 100, 0.1);
}

.form-input:disabled {
  background: #2a2a2a;
  color: #a0a0a0;
  cursor: not-allowed;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
}

.form-help {
  color: #a0a0a0;
  font-size: 0.85rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
}

.security-title {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.security-description {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.dummy-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #333333;
  border: 1px solid #555555;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.back-btn:hover {
  background: #444444;
  border-color: #00D664;
  color: #00D664;
  transform: translateY(-1px);
}

.back-btn i {
  font-size: 1rem;
}

/* Action Buttons */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  min-width: 120px;
  white-space: nowrap;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00D664 0%, #00b854 100%);
  color: #000000;
  width: auto;

  box-shadow: 0 2px 8px rgba(0, 214, 100, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #00b854 0%, #009944 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 214, 100, 0.4);
}

.action-btn.primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 214, 100, 0.3);
}

.action-btn.secondary {
  background: #333333;
  color: #ffffff;
  width: auto;
  border: 2px solid #555555;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary:hover:not(:disabled) {
  background: #444444;
  border-color: #777777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.action-btn.secondary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.action-btn:disabled {
  background: #666666 !important;
  color: #999999 !important;
  border-color: #666666 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
  opacity: 0.6;
}

.action-btn i {
  font-size: 1rem;
}

/* Form Actions Container */
.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Upload Actions */
.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.upload-actions .action-btn {
  min-width: 100px;
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
}

/* Close Button */
.close-btn {
  background: #333333;
  border: 2px solid #555555;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.close-btn:hover {
  background: #444444;
  border-color: #e74c3c;
  color: #e74c3c;
  transform: scale(1.05);
}

.close-btn i {
  font-size: 1.1rem;
}

/* Close Message Button */
.close-message {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-message:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* Security Item Button */
.security-item .action-btn {
  min-width: auto;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
}

/* Button Loading State */
.action-btn .spinning {
  animation: spin 1s linear infinite;
}

/* Button Focus States */
.action-btn:focus,
.back-btn:focus,
.close-btn:focus {
  outline: 2px solid #00D664;
  outline-offset: 2px;
}

/* Button Group Spacing */
.form-header .form-actions {
  gap: 0.75rem;
}

/* Responsive Button Adjustments */
@media (max-width: 768px) {
  .form-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .form-actions .action-btn {
    flex: 1;
    min-width: auto;
  }
  
  .upload-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .upload-actions .action-btn {
    width: 100%;
    min-width: auto;
  }
  
  .modal-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .modal-actions .action-btn {
    width: 100%;
    min-width: auto;
  }
  
  .back-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .form-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .form-actions {
    order: 2;
    justify-content: stretch;
  }
  
  .action-btn {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
  
  .security-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .security-item .action-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Button Hover Effects Enhancement */
.action-btn.primary:hover:not(:disabled)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  border-radius: 8px;
  pointer-events: none;
}

.action-btn {
  position: relative;
  overflow: hidden;
}

/* Upload Overlay Button */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: #ffffff;
  cursor: pointer;
  border-radius: 50%;
}

.upload-overlay:hover {
  background: rgba(0, 0, 0, 0.8);
}

.upload-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #00D664;
}

.upload-overlay span {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Enhanced Password Modal Styles */
.password-modal {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #333333;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00D664 0%, #00b854 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.header-icon i {
  font-size: 1.5rem;
  color: #000000;
}

.header-text {
  flex: 1;
}

.header-text h3 {
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.header-text p {
  color: #a0a0a0;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.close-btn {
  background: #333333;
  border: 2px solid #555555;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #444444;
  border-color: #e74c3c;
  color: #e74c3c;
  transform: scale(1.05);
}

/* Security Tips */
.security-tips {
  padding: 1.5rem 2rem;
  background: rgba(0, 214, 100, 0.05);
  border-bottom: 1px solid #333333;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #00D664;
  font-weight: 600;
}

.tip-header i {
  font-size: 1.1rem;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tip-item.valid {
  color: #00D664;
}

.tip-item i {
  font-size: 0.9rem;
  opacity: 0.5;
}

.tip-item.valid i {
  opacity: 1;
  color: #00D664;
}

/* Password Form */
.password-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group label i {
  color: #00D664;
  font-size: 1rem;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  background: #333333;
  border: 2px solid #555555;
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
  background: #3a3a3a;
}

.password-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.password-input.valid {
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #00D664;
  background: rgba(0, 214, 100, 0.1);
}

/* Password Strength Indicator */
.password-strength {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.strength-bar {
  height: 6px;
  background: #333333;
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.weak {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.strength-fill.fair {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.strength-fill.good {
  background: linear-gradient(90deg, #f1c40f, #f39c12);
}

.strength-fill.strong {
  background: linear-gradient(90deg, #00D664, #00b854);
}

.strength-text {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.strength-text.weak {
  color: #e74c3c;
}

.strength-text.fair {
  color: #f39c12;
}

.strength-text.good {
  color: #f1c40f;
}

.strength-text.strong {
  color: #00D664;
}

/* Password Match Indicator */
.password-match {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.match-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00D664;
}

.match-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e74c3c;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 500;
}

.error-message i {
  font-size: 0.9rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
}

.modal-overlay{
    display: flex;
    justify-content: center;
}
/* Responsive Design */
@media (max-width: 768px) {
  .password-modal {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem;
    position: fixed;
  }
  
  .password-form {
    padding: 1.5rem;
  }
  
  .tips-list {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .close-btn {
    align-self: flex-end;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .header-icon {
    align-self: center;
  }
}
</style>
