<template>
  <div class="add-route-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Back to Routes
        </button>
        <div class="header-info">
          <h1>Add New Route</h1>
          <p>Create a new transportation route for the Yatra platform</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="route-form">
        <!-- Basic Route Information -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-map-fill"></i>
            <h2>Route Information</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Route Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name"
                :class="{ 'error': errors.name }"
                placeholder="e.g., Ring Road Express"
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="type">Transport Type *</label>
              <select 
                id="type" 
                v-model="formData.type"
                :class="{ 'error': errors.type }"
                required
              >
                <option value="">Select Transport Type</option>
                <option value="bus">Bus</option>
                <option value="micro">Micro</option>
                <option value="tempo">Tempo</option>
              </select>
              <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
            </div>

            <div class="form-group">
              <label for="status">Route Status</label>
              <select id="status" v-model="formData.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="form-group">
              <label for="user">Assigned User</label>
              <select 
                id="user" 
                v-model="formData.user"
                :class="{ 'error': errors.user }"
              >
                <option value="">Select User (Optional)</option>
                <option v-for="user in availableUsers" :key="user._id" :value="user._id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
              <span v-if="errors.user" class="error-message">{{ errors.user }}</span>
              <p class="help-text">Assign this route to a specific user (driver/operator)</p>
            </div>
          </div>
        </div>

        <!-- Source Location -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-geo-alt-fill"></i>
            <h2>Source Location</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="source">Source Location</label>
              <input 
                type="text" 
                id="source" 
                v-model="formData.source"
                :class="{ 'error': errors.source }"
                placeholder="e.g., Kathmandu Bus Park"
              >
              <span v-if="errors.source" class="error-message">{{ errors.source }}</span>
            </div>

            <div class="form-group">
              <label for="sourceLat">Source Latitude</label>
              <input 
                type="number" 
                id="sourceLat" 
                v-model="formData.coordinates.source.lat"
                :class="{ 'error': errors.sourceLat }"
                placeholder="e.g., 27.7172"
                step="any"
              >
              <span v-if="errors.sourceLat" class="error-message">{{ errors.sourceLat }}</span>
            </div>

            <div class="form-group">
              <label for="sourceLon">Source Longitude</label>
              <input 
                type="number" 
                id="sourceLon" 
                v-model="formData.coordinates.source.lon"
                :class="{ 'error': errors.sourceLon }"
                placeholder="e.g., 85.3240"
                step="any"
              >
              <span v-if="errors.sourceLon" class="error-message">{{ errors.sourceLon }}</span>
            </div>

            <div class="form-group full-width">
              <button type="button" class="location-btn" @click="getCurrentLocation('source')">
                <i class="bi bi-geo-alt"></i>
                Get Current Location for Source
              </button>
            </div>
          </div>
        </div>

        <!-- Destination Location -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-pin-map-fill"></i>
            <h2>Destination Location</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="destination">Destination Location</label>
              <input 
                type="text" 
                id="destination" 
                v-model="formData.destination"
                :class="{ 'error': errors.destination }"
                placeholder="e.g., Pokhara Bus Station"
              >
              <span v-if="errors.destination" class="error-message">{{ errors.destination }}</span>
            </div>

            <div class="form-group">
              <label for="destLat">Destination Latitude</label>
              <input 
                type="number" 
                id="destLat" 
                v-model="formData.coordinates.destination.lat"
                :class="{ 'error': errors.destLat }"
                placeholder="e.g., 28.2096"
                step="any"
              >
              <span v-if="errors.destLat" class="error-message">{{ errors.destLat }}</span>
            </div>

            <div class="form-group">
              <label for="destLon">Destination Longitude</label>
              <input 
                type="number" 
                id="destLon" 
                v-model="formData.coordinates.destination.lon"
                :class="{ 'error': errors.destLon }"
                placeholder="e.g., 83.9856"
                step="any"
              >
              <span v-if="errors.destLon" class="error-message">{{ errors.destLon }}</span>
            </div>

            <div class="form-group full-width">
              <button type="button" class="location-btn" @click="getCurrentLocation('destination')">
                <i class="bi bi-geo-alt"></i>
                Get Current Location for Destination
              </button>
            </div>
          </div>
        </div>

        <!-- Route Preview -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-map"></i>
            <h2>Route Preview</h2>
          </div>
          
          <div class="preview-container">
            <div class="route-preview">
              <div class="preview-item">
                <div class="preview-label">Route Name</div>
                <div class="preview-value">{{ formData.name || 'Not specified' }}</div>
              </div>
              
              <div class="preview-item">
                <div class="preview-label">Transport Type</div>
                <div class="preview-value">
                  <span v-if="formData.type" class="type-badge" :class="formData.type">
                    <i :class="getTypeIcon(formData.type)"></i>
                    {{ formData.type.charAt(0).toUpperCase() + formData.type.slice(1) }}
                  </span>
                  <span v-else>Not selected</span>
                </div>
              </div>
              
              <div class="preview-item">
                <div class="preview-label">Status</div>
                <div class="preview-value">
                  <span class="status-badge" :class="formData.status">
                    <i :class="formData.status === 'active' ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
                    {{ formData.status.charAt(0).toUpperCase() + formData.status.slice(1) }}
                  </span>
                </div>
              </div>
              
              <div class="preview-item">
                <div class="preview-label">Source</div>
                <div class="preview-value">
                  {{ formData.source || 'Not specified' }}
                  <span v-if="formData.coordinates.source.lat && formData.coordinates.source.lon" class="coordinates">
                    ({{ formData.coordinates.source.lat }}, {{ formData.coordinates.source.lon }})
                  </span>
                </div>
              </div>
              
              <div class="preview-item">
                <div class="preview-label">Destination</div>
                <div class="preview-value">
                  {{ formData.destination || 'Not specified' }}
                  <span v-if="formData.coordinates.destination.lat && formData.coordinates.destination.lon" class="coordinates">
                    ({{ formData.coordinates.destination.lat }}, {{ formData.coordinates.destination.lon }})
                  </span>
                </div>
              </div>
              
              <div class="preview-item">
                <div class="preview-label">Assigned User</div>
                <div class="preview-value">
                  {{ getSelectedUserName() || 'Not assigned' }}
                </div>
              </div>
              
              <div class="preview-item" v-if="calculateDistance()">
                <div class="preview-label">Estimated Distance</div>
                <div class="preview-value">{{ calculateDistance() }} km</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Nepal Routes Suggestions -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-lightbulb"></i>
            <h2>Popular Nepal Routes</h2>
          </div>
          
          <div class="suggestions-container">
            <p class="suggestions-text">Click on a popular route to auto-fill the form:</p>
            <div class="suggestions-grid">
              <button 
                v-for="route in popularRoutes" 
                :key="route.id"
                type="button" 
                class="suggestion-btn"
                @click="fillPopularRoute(route)"
              >
                <div class="suggestion-route">
                  <i :class="getTypeIcon(route.type)"></i>
                  <div class="suggestion-info">
                    <div class="suggestion-name">{{ route.name }}</div>
                    <div class="suggestion-path">{{ route.source }} → {{ route.destination }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="resetForm">
            <i class="bi bi-arrow-clockwise"></i>
            Reset Form
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <i class="bi bi-check-circle" v-if="!isSubmitting"></i>
            <i class="bi bi-hourglass-split spinning" v-else></i>
            {{ isSubmitting ? 'Creating Route...' : 'Create Route' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

// Reactive data
const isSubmitting = ref(false)

const formData = reactive({
  name: '',
  source: '',
  destination: '',
  coordinates: {
    source: {
      lat: null,
      lon: null
    },
    destination: {
      lat: null,
      lon: null
    }
  },
  type: '', // Required: 'bus', 'micro', 'tempo'
  status: 'active', // Default: 'active'
  user: '' // ObjectId reference to User
})

const errors = reactive({})

// Mock users data (in real app, this would come from API)
const availableUsers = ref([
  { _id: '507f1f77bcf86cd799439011', name: 'Ram Sharma', email: 'ram@example.com' },
  { _id: '507f1f77bcf86cd799439012', name: 'Sita Gurung', email: 'sita@example.com' },
  { _id: '507f1f77bcf86cd799439013', name: 'Hari Thapa', email: 'hari@example.com' },
  { _id: '507f1f77bcf86cd799439014', name: 'Maya Rai', email: 'maya@example.com' }
])

// Popular Nepal routes for suggestions
const popularRoutes = [
  {
    id: 1,
    name: 'Kathmandu-Pokhara Express',
    source: 'Kathmandu Bus Park',
    destination: 'Pokhara Bus Station',
    coordinates: {
      source: { lat: 27.7172, lon: 85.3240 },
      destination: { lat: 28.2096, lon: 83.9856 }
    },
    type: 'bus'
  },
  {
    id: 2,
    name: 'Kathmandu-Chitwan Route',
    source: 'New Bus Park, Kathmandu',
    destination: 'Bharatpur, Chitwan',
    coordinates: {
      source: { lat: 27.7172, lon: 85.3240 },
      destination: { lat: 27.6747, lon: 84.4339 }
    },
    type: 'bus'
  },
  {
    id: 3,
    name: 'Ring Road Circuit',
    source: 'Ratna Park',
    destination: 'Koteshwor',
    coordinates: {
      source: { lat: 27.7056, lon: 85.3145 },
      destination: { lat: 27.6761, lon: 85.3475 }
    },
    type: 'micro'
  },
  {
    id: 4,
    name: 'Thamel-Airport Shuttle',
    source: 'Thamel',
    destination: 'Tribhuvan Airport',
    coordinates: {
      source: { lat: 27.7145, lon: 85.3094 },
      destination: { lat: 27.6966, lon: 85.3591 }
    },
    type: 'tempo'
  },
  {
    id: 5,
    name: 'Kathmandu-Bhaktapur Route',
    source: 'Ratna Park, Kathmandu',
    destination: 'Bhaktapur Durbar Square',
    coordinates: {
      source: { lat: 27.7056, lon: 85.3145 },
      destination: { lat: 27.6710, lon: 85.4298 }
    },
    type: 'micro'
  },
  {
    id: 6,
    name: 'Lalitpur Local',
    source: 'Lagankhel',
    destination: 'Patan Dhoka',
    coordinates: {
      source: { lat: 27.6663, lon: 85.3242 },
      destination: { lat: 27.6766, lon: 85.3250 }
    },
    type: 'tempo'
  }
]

// Methods
const getTypeIcon = (type) => {
  const icons = {
    bus: 'bi bi-bus-front',
    micro: 'bi bi-truck',
    tempo: 'bi bi-car-front'
  }
  return icons[type] || 'bi bi-question-circle'
}

const getSelectedUserName = () => {
  const selectedUser = availableUsers.value.find(user => user._id === formData.user)
  return selectedUser ? selectedUser.name : null
}

const calculateDistance = () => {
  const { source, destination } = formData.coordinates
  if (source.lat && source.lon && destination.lat && destination.lon) {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in kilometers
    const dLat = (destination.lat - source.lat) * Math.PI / 180
    const dLon = (destination.lon - source.lon) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(source.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }
  return null
}

const getCurrentLocation = (locationType) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (locationType === 'source') {
          formData.coordinates.source.lat = latitude
          formData.coordinates.source.lon = longitude
        } else {
          formData.coordinates.destination.lat = latitude
          formData.coordinates.destination.lon = longitude
        }
        alert(`${locationType} location updated successfully!`)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get current location. Please enter coordinates manually.')
      }
    )
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

const fillPopularRoute = (route) => {
  formData.name = route.name
  formData.source = route.source
  formData.destination = route.destination
  formData.coordinates.source.lat = route.coordinates.source.lat
  formData.coordinates.source.lon = route.coordinates.source.lon
  formData.coordinates.destination.lat = route.coordinates.destination.lat
  formData.coordinates.destination.lon = route.coordinates.destination.lon
  formData.type = route.type
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validation rules based on schema
  if (!formData.type) {
    errors.type = 'Transport type is required'
  }

  // Validate coordinates if provided
  if (formData.coordinates.source.lat && (formData.coordinates.source.lat < -90 || formData.coordinates.source.lat > 90)) {
    errors.sourceLat = 'Latitude must be between -90 and 90'
  }

  if (formData.coordinates.source.lon && (formData.coordinates.source.lon < -180 || formData.coordinates.source.lon > 180)) {
    errors.sourceLon = 'Longitude must be between -180 and 180'
  }

  if (formData.coordinates.destination.lat && (formData.coordinates.destination.lat < -90 || formData.coordinates.destination.lat > 90)) {
    errors.destLat = 'Latitude must be between -90 and 90'
  }

  if (formData.coordinates.destination.lon && (formData.coordinates.destination.lon < -180 || formData.coordinates.destination.lon > 180)) {
    errors.destLon = 'Longitude must be between -180 and 180'
  }

  return Object.keys(errors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Prepare data according to schema
    const routeData = {
      name: formData.name || undefined, // Optional field
      source: formData.source || undefined, // Optional field
      destination: formData.destination || undefined, // Optional field
      coordinates: {
        source: {
          lat: formData.coordinates.source.lat || undefined,
          lon: formData.coordinates.source.lon || undefined
        },
        destination: {
          lat: formData.coordinates.destination.lat || undefined,
          lon: formData.coordinates.destination.lon || undefined
        }
      },
      type: formData.type, // Required
      status: formData.status, // Default: 'active'
      user: formData.user || undefined // Optional ObjectId reference
    }

    // Clean up undefined values
    Object.keys(routeData).forEach(key => {
      if (routeData[key] === undefined) {
        delete routeData[key]
      }
    })

    // Clean up coordinates if empty
    if (!routeData.coordinates.source.lat && !routeData.coordinates.source.lon) {
      delete routeData.coordinates.source
    }
    if (!routeData.coordinates.destination.lat && !routeData.coordinates.destination.lon) {
      delete routeData.coordinates.destination
    }
    if (!routeData.coordinates.source && !routeData.coordinates.destination) {
      delete routeData.coordinates
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Route data to be sent to API:', routeData)
    alert('Route created successfully!')
    
    // Reset form after successful submission
    resetForm()
  } catch (error) {
    console.error('Error creating route:', error)
    alert('Error creating route. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // Reset all form data
  formData.name = ''
  formData.source = ''
  formData.destination = ''
  formData.coordinates.source.lat = null
  formData.coordinates.source.lon = null
  formData.coordinates.destination.lat = null
  formData.coordinates.destination.lon = null
  formData.type = ''
  formData.status = 'active'
  formData.user = ''
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

const goBack = () => {
  // In a real app, this would use Vue Router
  router.push('/admin')
}
</script>

<style scoped>
.add-route-page {
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

.route-form {
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
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

.location-btn {
  background: #00D664;
  color: #000000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  justify-content: center;
}

.location-btn:hover {
  background: #00b854;
}

.preview-container {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 1.5rem;
}

.route-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.preview-item {
  padding: 1rem;
  background: #333333;
  border-radius: 6px;
}

.preview-label {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.preview-value {
  color: #ffffff;
  font-size: 0.95rem;
  word-break: break-word;
}

.coordinates {
  color: #00D664;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.25rem;
}

.type-badge, .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.type-badge.bus {
  background: #3498db;
  color: #ffffff;
}

.type-badge.micro {
  background: #f39c12;
  color: #ffffff;
}

.type-badge.tempo {
  background: #9b59b6;
  color: #ffffff;
}

.status-badge.active {
  background: #27ae60;
  color: #ffffff;
}

.status-badge.inactive {
  background: #e74c3c;
  color: #ffffff;
}

.suggestions-container {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 1.5rem;
}

.suggestions-text {
  color: #a0a0a0;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.suggestion-btn {
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.suggestion-btn:hover {
  background: #444444;
  border-color: #00D664;
}

.suggestion-route {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.suggestion-route i {
  font-size: 1.5rem;
  color: #00D664;
}

.suggestion-info {
  flex: 1;
}

.suggestion-name {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.suggestion-path {
  color: #a0a0a0;
  font-size: 0.85rem;
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
  .route-preview,
  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .header-info h1 {
    font-size: 1.5rem;
  }
}
</style>