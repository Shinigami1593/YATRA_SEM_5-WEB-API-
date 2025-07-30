<template>
  <div class="edit-trip-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          Back to Trips
        </button>
        <div class="header-info">
          <h1>Edit Trip Schedule</h1>
          <p>Update trip schedule information for the Yatra platform</p>
          <div class="trip-id-display">
            <span class="id-label">Trip ID:</span>
            <span class="id-value">{{ tripId }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split spinning"></i>
        <p>Loading trip details...</p>
      </div>
    </div>

    <!-- Form Container -->
    <div v-else class="form-container">
      <form class="trip-form">
        <!-- Route Selection -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-map-fill"></i>
            <h2>Route Selection</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="route">Select Route *</label>
              <select 
                id="route" 
                v-model="formData.route"
                :class="{ 'error': errors.route }"
                @change="onRouteChange"
                required
              >
                <!-- <option value="">Choose a route</option> -->
                <option v-for="route in availableRoutes" :key="route.id" :value="route.id">
                  {{ route.name }} - {{ route.source }} → {{ route.destination }} ({{ route.type }})
                </option>
              </select>
              <span v-if="errors.route" class="error-message">{{ errors.route }}</span>
            </div>

            <!-- Route Details Display -->
            <div v-if="selectedRoute" class="route-details">
              <div class="route-info-card">
                <div class="route-header">
                  <i :class="getTypeIcon(selectedRoute.type)"></i>
                  <div class="route-title">
                    <h3>{{ selectedRoute.name }}</h3>
                    <span class="route-type">{{ selectedVehicle.type.toUpperCase() }}</span>
                  </div>
                  <span class="status-badge" :class="selectedRoute.status">
                    {{ selectedRoute.status }}
                  </span>
                </div>
                
                <div class="route-path">
                  <div class="location-point">
                    <i class="bi bi-geo-alt-fill source"></i>
                    <div class="location-info">
                      <div class="location-name">{{ selectedRoute.source }}</div>
                      <div class="coordinates">
                        {{ selectedRoute.coordinates.source.coordinates[1] }}, 
                        {{ selectedRoute.coordinates.source.coordinates[0] }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="route-line">
                    <div class="line"></div>
                    <i class="bi bi-arrow-down"></i>
                  </div>
                  
                  <div class="location-point">
                    <i class="bi bi-pin-map-fill destination"></i>
                    <div class="location-info">
                      <div class="location-name">{{ selectedRoute.destination }}</div>
                      <div class="coordinates">
                        {{ selectedRoute.coordinates.destination.coordinates[1] }}, 
                        {{ selectedRoute.coordinates.destination.coordinates[0] }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="route-distance" v-if="routeDistance">
                  <i class="bi bi-speedometer2"></i>
                  <span>Estimated Distance: {{ routeDistance }} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Selection -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-truck"></i>
            <h2>Vehicle Selection</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="vehicle">Select Vehicle *</label>
              <select 
                id="vehicle" 
                v-model="formData.vehicle"
                :class="{ 'error': errors.vehicle }"
                required
              >
                <!-- <option value="">Choose a vehicle</option> -->
                <option v-for="vehicle in availableVehicles" :key="vehicle._id" :value="vehicle._id">
                  {{ vehicle.type }} - ID: {{ vehicle._id.slice(-6) }}
                </option>
              </select>
              <span v-if="errors.vehicle" class="error-message">{{ errors.vehicle }}</span>
              <p v-if="selectedRoute && !compatibleVehicles.length" class="help-text warning">
                <i class="bi bi-exclamation-triangle"></i>
                No compatible vehicles found for this route type ({{ selectedRoute.type }})
              </p>
              <p v-else-if="selectedRoute" class="help-text">
                Showing vehicles compatible with {{ selectedRoute.type }} routes
              </p>
            </div>

            <!-- Vehicle Details Display -->
            <div v-if="selectedVehicle" class="vehicle-details">
              <div class="vehicle-info-card">
                <div class="vehicle-header">
                  <i :class="getTypeIcon(selectedVehicle.type.toLowerCase())"></i>
                  <div class="vehicle-title">
                    <h3>{{ selectedVehicle.type }}</h3>
                    <span class="vehicle-id">ID: {{ selectedVehicle._id }}</span>
                  </div>
                </div>
                
                <div class="vehicle-meta">
                  <div class="meta-item">
                    <i class="bi bi-calendar-plus"></i>
                    <span>Created: {{ formatDate(selectedVehicle.createdAt) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-arrow-clockwise"></i>
                    <span>Updated: {{ formatDate(selectedVehicle.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Information -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-clock-fill"></i>
            <h2>Schedule Information</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="departureTime">Departure Time *</label>
              <input 
                type="time" 
                id="departureTime" 
                v-model="formData.departureTime"
                :class="{ 'error': errors.departureTime }"
                :min="minDateTime"
                required
              >
              <span v-if="errors.departureTime" class="error-message">{{ errors.departureTime }}</span>
            </div>

            <div class="form-group">
              <label for="arrivalTime">Arrival Time *</label>
              <input 
                type="time" 
                id="arrivalTime" 
                v-model="formData.arrivalTime"
                :class="{ 'error': errors.arrivalTime }"
                :min="formData.departureTime"
                required
              >
              <span v-if="errors.arrivalTime" class="error-message">{{ errors.arrivalTime }}</span>
            </div>

            <div class="form-group">
              <label for="status">Trip Status</label>
              <select id="status" v-model="formData.status">
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <!-- Duration Display -->
            <div v-if="tripDuration" class="form-group">
              <label>Trip Duration</label>
              <div class="duration-display">
                <i class="bi bi-hourglass-split"></i>
                <span>{{ tripDuration }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Trip History -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-clock-history"></i>
            <h2>Trip History</h2>
          </div>
          
          <div class="history-container">
            <div class="history-grid">
              <div class="history-item">
                <div class="history-label">Created</div>
                <div class="history-value">
                  <i class="bi bi-calendar-plus"></i>
                  {{ formatDateTime(originalTripData.createdAt) }}
                </div>
              </div>
              
              <div class="history-item">
                <div class="history-label">Last Updated</div>
                <div class="history-value">
                  <i class="bi bi-arrow-clockwise"></i>
                  {{ formatDateTime(originalTripData.updatedAt || originalTripData.createdAt) }}
                </div>
              </div>
              
              <div class="history-item">
                <div class="history-label">Original Status</div>
                <div class="history-value">
                  <span class="status-badge" :class="originalTripData.status">
                    <i :class="getStatusIcon(originalTripData.status)"></i>
                    {{ originalTripData.status.charAt(0).toUpperCase() + originalTripData.status.slice(1) }}
                  </span>
                </div>
              </div>
              
              <div class="history-item">
                <div class="history-label">Trip ID</div>
                <div class="history-value">
                  <span class="trip-id-display">{{ tripId }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trip Summary -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-info-circle"></i>
            <h2>Updated Trip Summary</h2>
          </div>
          
          <div class="summary-container">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Route</div>
                <div class="summary-value">
                  {{ selectedRoute ? selectedRoute.name : 'Not selected' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Path</div>
                <div class="summary-value">
                  {{ selectedRoute ? `${selectedRoute.source} → ${selectedRoute.destination}` : 'Not selected' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Vehicle</div>
                <div class="summary-value">
                  {{ selectedVehicle ? `${selectedVehicle.type} (${selectedVehicle._id.slice(-6)})` : 'Not selected' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Departure</div>
                <div class="summary-value">
                  {{ formData.departureTime ? formatDateTime(formData.departureTime) : 'Not set' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Arrival</div>
                <div class="summary-value">
                  {{ formData.arrivalTime ? formatDateTime(formData.arrivalTime) : 'Not set' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Status</div>
                <div class="summary-value">
                  <span class="status-badge" :class="formData.status">
                    <i :class="getStatusIcon(formData.status)"></i>
                    {{ formData.status.charAt(0).toUpperCase() + formData.status.slice(1) }}
                  </span>
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Duration</div>
                <div class="summary-value">
                  {{ tripDuration || 'Not calculated' }}
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-label">Distance</div>
                <div class="summary-value">
                  {{ routeDistance ? `${routeDistance} km` : 'Not calculated' }}
                </div>
              </div>
            </div>

            <!-- Changes Indicator -->
            <div v-if="hasChanges" class="changes-indicator">
              <div class="changes-header">
                <i class="bi bi-exclamation-triangle"></i>
                <span>Pending Changes</span>
              </div>
              <div class="changes-list">
                <div v-for="change in pendingChanges" :key="change.field" class="change-item">
                  <span class="change-field">{{ change.field }}:</span>
                  <span class="change-from">{{ change.from }}</span>
                  <i class="bi bi-arrow-right"></i>
                  <span class="change-to">{{ change.to }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="resetForm">
            <i class="bi bi-arrow-clockwise"></i>
            Reset Changes
          </button>
          <button type="button" class="btn-danger" @click="deleteTrip">
            <i class="bi bi-trash"></i>
            Delete Trip
          </button>
          <button @click="updateTripData" type="submit" class="btn-primary" :disabled="isSubmitting || !hasChanges">
            <i class="bi bi-check-circle" v-if="!isSubmitting"></i>
            <i class="bi bi-hourglass-split spinning" v-else></i>
            {{ isSubmitting ? 'Updating Trip...' : 'Update Trip Schedule' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { adminApiClient, tripApiClient, vehicleApiClient } from '@/services/axios'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Get trip ID from route params
const route = useRoute()
const tripId = route.params.id

// Reactive data
const loading = ref(true)
const isSubmitting = ref(false)

const formData = reactive({
  route: '',
  vehicle: '',
  departureTime: '',
  arrivalTime: '',
  status: 'scheduled'
})

const originalTripData = ref({})
const errors = reactive({})

// Mock routes data
const availableRoutes = ref([])

// console.log(availableRoutes)

const fetchRoutes = async () => {
  try {
    const res = await adminApiClient.get('/routes')
    availableRoutes.value = res.data.routes.map(route => {
      const props = route.properties || {}
      return {
        id: props.id || '',
        name: props.name || '',
        source: props.source || '',
        destination: props.destination || '',
        type: props.type || '',
        status: props.status || '',
        user: props.user || null,
        geometry: route.geometry || {}
      }
    })
  } catch (error) {
    console.error('Failed to load routes:', error)
  }
}

// Mock vehicles data (in real app, this would come from API)
const availableVehicles = ref([])

const fetchVehicles = async () => {
  try {
    const res = await vehicleApiClient.get('/')
    availableVehicles.value = res.data.vehicles
    console.log('Fetched vehicles:', availableVehicles.value)
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  }
}

// Computed properties
const selectedRoute = computed(() => {
  return availableRoutes.value?.find(route => route._id === formData.route)
})

const selectedVehicle = computed(() => {
  return availableVehicles.value.find(vehicle => vehicle._id === formData.vehicle)
})

const compatibleVehicles = computed(() => {
  if (!selectedRoute.value) return []

  return availableVehicles.value.filter(vehicle =>
    vehicle.type === selectedRoute.value.type
  )
})

const minDateTime = computed(() => {
  const now = new Date()
  return now.toISOString().slice(0, 16)
})

const tripDuration = computed(() => {
  if (formData.departureTime && formData.arrivalTime) {
    const departure = new Date(formData.departureTime)
    const arrival = new Date(formData.arrivalTime)
    const diffMs = arrival - departure
    
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    }
  }
  return null
})

const routeDistance = computed(() => {
  if (selectedRoute.value) {
    const { source, destination } = selectedRoute.value.coordinates
    const R = 6371
    
    const lat1 = source.coordinates[1] * Math.PI / 180
    const lat2 = destination.coordinates[1] * Math.PI / 180
    const deltaLat = (destination.coordinates[1] - source.coordinates[1]) * Math.PI / 180
    const deltaLon = (destination.coordinates[0] - source.coordinates[0]) * Math.PI / 180
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    return Math.round(distance * 10) / 10
  }
  return null
})

const hasChanges = computed(() => {
  if (!originalTripData.value._id) return false
  
  return (
    formData.route !== originalTripData.value.route._id ||
    formData.vehicle !== originalTripData.value.vehicle._id ||
    formData.departureTime !== originalTripData.value.departureTime ||
    formData.arrivalTime !== originalTripData.value.arrivalTime ||
    formData.status !== originalTripData.value.status
  )
})

const pendingChanges = computed(() => {
  if (!originalTripData.value._id) return []
  
  const changes = []
  
  if (formData.route !== originalTripData.value.route._id) {
    const oldRoute = availableRoutes.value.find(r => r._id === originalTripData.value.route._id)
    const newRoute = availableRoutes.value.find(r => r._id === formData.route)
    changes.push({
      field: 'Route',
      from: oldRoute?.name || 'Unknown',
      to: newRoute?.name || 'Unknown'
    })
  }
  
  if (formData.vehicle !== originalTripData.value.vehicle._id) {
    const oldVehicle = availableVehicles.value.find(v => v._id === originalTripData.value.vehicle._id)
    const newVehicle = availableVehicles.value.find(v => v._id === formData.vehicle)
    changes.push({
      field: 'Vehicle',
      from: oldVehicle ? `${oldVehicle.type} (${oldVehicle._id.slice(-6)})` : 'Unknown',
      to: newVehicle ? `${newVehicle.type} (${newVehicle._id.slice(-6)})` : 'Unknown'
    })
  }
  
  if (formData.departureTime !== originalTripData.value.departureTime) {
    changes.push({
      field: 'Departure Time',
      from: formatDateTime(originalTripData.value.departureTime),
      to: formatDateTime(formData.departureTime)
    })
  }
  
  if (formData.arrivalTime !== originalTripData.value.arrivalTime) {
    changes.push({
      field: 'Arrival Time',
      from: formatDateTime(originalTripData.value.arrivalTime),
      to: formatDateTime(formData.arrivalTime)
    })
  }
  
  if (formData.status !== originalTripData.value.status) {
    changes.push({
      field: 'Status',
      from: originalTripData.value.status.charAt(0).toUpperCase() + originalTripData.value.status.slice(1),
      to: formData.status.charAt(0).toUpperCase() + formData.status.slice(1)
    })
  }
  return changes
})

// Watchers
watch(() => formData.route, () => {
  if (formData.route !== originalTripData.value.route?._id) {
    formData.vehicle = ''
  }
})

// Methods
const getTypeIcon = (type) => {
  const icons = {
    bus: 'bi bi-bus-front',
    micro: 'bi bi-truck',
    tempo: 'bi bi-car-front'
  }
  return icons[type] || 'bi bi-question-circle'
}

const getStatusIcon = (status) => {
  const icons = {
    scheduled: 'bi bi-clock',
    cancelled: 'bi bi-x-circle',
    completed: 'bi bi-check-circle'
  }
  return icons[status] || 'bi bi-question-circle'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Not set'
  return new Date(dateTimeString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTripData = async () => {
  loading.value = true

  try {
    const response = await tripApiClient.get(`/${tripId}`)
    const tripData = response.data

    originalTripData.value = tripData

    formData.value.route = tripData.route?.id || ''
    formData.value.vehicle = tripData.vehicle?.id || ''
    formData.value.departureTime = tripData.departureTime?.slice(0, 16) || ''
    formData.value.arrivalTime = tripData.arrivalTime?.slice(0, 16) || ''
    formData.value.status = tripData.status || ''

  } catch (error) {
    console.error('Error fetching trip data:', error)
    alert('Failed to load trip data.')
  } finally {
    loading.value = false
  }
}

//update:
const updateTripData = async () => {
  if (!tripId) return;

  isSubmitting.value = true;

  try {
    const response = await tripApiClient.put(`/admin/${tripId}`, {
      route: formData.route,
      vehicle: formData.vehicle,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      status: formData.status,
    });

    // Optional: check for successful status code explicitly
    if (response.status === 200 || response.status === 204) {
      alert('Trip updated successfully!');
      hasChanges.value = false; // Reset change tracking
      router.push('/admin/dashboard'); // replace with your actual route
    } else {
      alert('Unexpected response from server.');
    }
  } catch (error) {
    console.error('Error updating trip:', error);
    alert('Failed to update trip. Please check your inputs and try again.');
  } finally {
    isSubmitting.value = false;
  }
};


const onRouteChange = () => {
  console.log('Route changed to:', selectedRoute.value?.name)
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!formData.route) {
    errors.route = 'Route selection is required'
  }

  if (!formData.vehicle) {
    errors.vehicle = 'Vehicle selection is required'
  }

  if (!formData.departureTime) {
    errors.departureTime = 'Departure time is required'
  }

  if (!formData.arrivalTime) {
    errors.arrivalTime = 'Arrival time is required'
  }

  if (formData.departureTime && formData.arrivalTime) {
    const departure = new Date(formData.departureTime)
    const arrival = new Date(formData.arrivalTime)
    
    if (arrival <= departure) {
      errors.arrivalTime = 'Arrival time must be after departure time'
    }
  }

  return Object.keys(errors).length === 0
}

// const submitForm = async () => {
//   if (!validateForm()) {
//     return
//   }

//   if (!hasChanges.value) {
//     alert('No changes detected to save.')
//     return
//   }

//   isSubmitting.value = true

//   try {
//     const tripData = {
//       _id: tripId,
//       route: formData.route,
//       vehicle: formData.vehicle,
//       departureTime: new Date(formData.departureTime).toISOString(),
//       arrivalTime: new Date(formData.arrivalTime).toISOString(),
//       status: formData.status,
//       updatedAt: new Date().toISOString()
//     }

//     await new Promise(resolve => setTimeout(resolve, 2000))
    
//     console.log('Updated trip data:', tripData)
//     alert('Trip schedule updated successfully!')
    
//     // Update original data to reflect changes
//     originalTripData.value = {
//       ...originalTripData.value,
//       route: { _id: formData.route, ...selectedRoute.value },
//       vehicle: { _id: formData.vehicle, ...selectedVehicle.value },
//       departureTime: formData.departureTime,
//       arrivalTime: formData.arrivalTime,
//       status: formData.status,
//       updatedAt: new Date().toISOString()
//     }
    
//   } catch (error) {
//     console.error('Error updating trip:', error)
//     alert('Error updating trip schedule. Please try again.')
//   } finally {
//     isSubmitting.value = false
//   }
// }

const resetForm = () => {
  if (originalTripData.value._id) {
    formData.route = originalTripData.value.route._id
    formData.vehicle = originalTripData.value.vehicle._id
    formData.departureTime = originalTripData.value.departureTime
    formData.arrivalTime = originalTripData.value.arrivalTime
    formData.status = originalTripData.value.status
  }
  
  Object.keys(errors).forEach(key => delete errors[key])
}

const deleteTrip = () => {
  if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
    console.log('Deleting trip:', tripId)
    alert('Trip deleted successfully!')
    goBack()
  }
}

const goBack = () => {
  console.log('Going back to trips page...')
  alert('Going back to trips page...')
}

// Lifecycle
onMounted(async() => {
  await loadTripData()
  await fetchRoutes()
  await fetchVehicles()
})
</script>

<style scoped>
/* Base styles - same as AddTripPage.vue */
.edit-trip-page {
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
  margin: 0 0 1rem 0;
}

.trip-id-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #333333;
  border-radius: 8px;
  border: 1px solid #555555;
  width: fit-content;
}

.id-label {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.id-value {
  color: #00D664;
  font-family: monospace;
  font-weight: 600;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 3rem;
  color: #00D664;
  margin-bottom: 1rem;
}

.loading-spinner p {
  color: #a0a0a0;
  font-size: 1.1rem;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.trip-form {
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

.form-group input:disabled,
.form-group select:disabled {
  background: #2a2a2a;
  color: #666666;
  cursor: not-allowed;
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

.help-text.warning {
  color: #f39c12;
}

.help-text i {
  margin-right: 0.25rem;
}

.duration-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  color: #00D664;
  font-weight: 500;
}

.route-details,
.vehicle-details {
  grid-column: 1 / -1;
  margin-top: 1rem;
}

.route-info-card,
.vehicle-info-card {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 1.5rem;
}

.route-header,
.vehicle-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.route-header i,
.vehicle-header i {
  font-size: 2rem;
  color: #00D664;
}

.route-title,
.vehicle-title {
  flex: 1;
}

.route-title h3,
.vehicle-title h3 {
  margin: 0 0 0.25rem 0;
  color: #ffffff;
  font-size: 1.2rem;
}

.route-type,
.vehicle-id {
  color: #a0a0a0;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.active,
.status-badge.scheduled {
  background: #27ae60;
  color: #ffffff;
}

.status-badge.inactive,
.status-badge.cancelled {
  background: #e74c3c;
  color: #ffffff;
}

.status-badge.completed {
  background: #3498db;
  color: #ffffff;
}

.route-path {
  margin-bottom: 1rem;
}

.location-point {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.location-point i.source {
  color: #27ae60;
  font-size: 1.2rem;
}

.location-point i.destination {
  color: #e74c3c;
  font-size: 1.2rem;
}

.location-info {
  flex: 1;
}

.location-name {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.coordinates {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.route-line {
  display: flex;
  align-items: center;
  margin: 0.5rem 0 0.5rem 0.6rem;
}

.line {
  width: 2px;
  height: 20px;
  background: #555555;
  margin-right: 1rem;
}

.route-line i {
  color: #00D664;
}

.route-distance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00D664;
  font-weight: 500;
}

.vehicle-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.meta-item i {
  color: #00D664;
}

/* History Section Styles */
.history-container {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 1.5rem;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background: #333333;
  border-radius: 6px;
}

.history-label {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.history-value {
  color: #ffffff;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.history-value i {
  color: #00D664;
}

.trip-id-display {
  font-family: monospace;
  color: #00D664;
  font-weight: 600;
}

/* Summary Section Styles */
.summary-container {
  background: #2a2a2a;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  padding: 1rem;
  background: #333333;
  border-radius: 6px;
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

/* Changes Indicator Styles */
.changes-indicator {
  background: rgba(243, 156, 18, 0.1);
  border: 1px solid #f39c12;
  border-radius: 8px;
  padding: 1rem;
}

.changes-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  font-weight: 600;
  margin-bottom: 1rem;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.change-field {
  color: #ffffff;
  font-weight: 500;
  min-width: 120px;
}

.change-from {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.change-to {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.change-item i {
  color: #a0a0a0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #333333;
}

.btn-primary, .btn-secondary, .btn-danger {
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

.btn-danger {
  background: #e74c3c;
  color: #ffffff;
}

.btn-primary:hover {
  background: #00b854;
}

.btn-secondary:hover {
  background: #444444;
}

.btn-danger:hover {
  background: #c0392b;
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
  .summary-grid,
  .history-grid {
    grid-template-columns: 1fr;
  }

  .route-header,
  .vehicle-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .vehicle-meta {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .header-info h1 {
    font-size: 1.5rem;
  }

  .change-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .change-field {
    min-width: auto;
  }
}
</style>