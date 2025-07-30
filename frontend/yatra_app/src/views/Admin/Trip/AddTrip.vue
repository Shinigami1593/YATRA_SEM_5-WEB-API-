<template>
  <div class="add-trip-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <router-link to="/admin/dashboard#" style="text-decoration: noen;">
            <button class="back-btn" @click="goBack">
            <i class="bi bi-arrow-left"></i>
            Back to Trips
            </button>
        </router-link>
        <div class="header-info">
          <h1>Add New Trip Schedule</h1>
          <p>Create a new trip schedule for the Yatra platform</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="trip-form">
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
                <option value="">Choose a route</option>
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
                    <span class="route-type">{{ selectedRoute.type() }}</span>
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
                <option value="">Choose a vehicle</option>
                <option v-for="vehicle in availableVehicles" :key="vehicle._id" :value="vehicle._id">
                  {{ vehicle.type }}
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
                  <i :class="getTypeIcon(selectedVehicle.type)"></i>
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

        <!-- Trip Summary -->
        <div class="form-section">
          <div class="section-header">
            <i class="bi bi-info-circle"></i>
            <h2>Trip Summary</h2>
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
            {{ isSubmitting ? 'Creating Trip...' : 'Create Trip Schedule' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { adminApiClient, tripApiClient, vehicleApiClient } from '@/services/axios'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRoute } from 'vue-router'


const router = useRoute();


// Reactive data
const isSubmitting = ref(false)

const formData = reactive({
  route: '', // ObjectId reference to Route
  vehicle: '', // ObjectId reference to Vehicle
  departureTime: '',
  arrivalTime: '',
  status: 'scheduled' // Default: 'scheduled'
})

const errors = reactive({})

// Mock routes data (in real app, this would come from API)
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
  return now.toISOString().slice(0, 16) // Format for datetime-local input
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
    // Calculate distance using Haversine formula
    const { source, destination } = selectedRoute.value.coordinates
    const R = 6371 // Earth's radius in kilometers
    
    const lat1 = source.coordinates[1] * Math.PI / 180
    const lat2 = destination.coordinates[1] * Math.PI / 180
    const deltaLat = (destination.coordinates[1] - source.coordinates[1]) * Math.PI / 180
    const deltaLon = (destination.coordinates[0] - source.coordinates[0]) * Math.PI / 180
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }
  return null
})

// Watchers
watch(() => formData.route, () => {
  // Reset vehicle selection when route changes
  formData.vehicle = ''
})

// Methods
const getTypeIcon = (type) => {
  const icons = {
    Bus: 'bi bi-bus-front',
    Micro: 'bi bi-truck-front',
    Tempo: 'bi bi-car-front'
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
  return new Date(dateTimeString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onRouteChange = () => {
  // Additional logic when route changes if needed
  console.log('Route changed to:', selectedRoute.value?.name)
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validation rules based on schema
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

  // Validate that arrival time is after departure time
  if (formData.departureTime && formData.arrivalTime) {
    const departure = new Date(formData.departureTime)
    const arrival = new Date(formData.arrivalTime)
    
    if (arrival <= departure) {
      errors.arrivalTime = 'Arrival time must be after departure time'
    }
  }

  // Validate that departure time is in the future
  if (formData.departureTime) {
    const departure = new Date(formData.departureTime)
    const now = new Date()
    
    if (departure <= now) {
      errors.departureTime = 'Departure time must be in the future'
    }
  }

  return Object.keys(errors).length === 0
}


const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const tripData = {
      route: formData.route,
      vehicle: formData.vehicle,
      departureTime: formData.departureTime, // already HH:MM
      arrivalTime: formData.arrivalTime      // already HH:MM
    };

    const res = await tripApiClient.post('/admin', tripData); // POST to /trip/admin
    console.log('Trip created:', res.data);

    alert('Trip schedule created successfully!');
    resetForm();
    router.push({path : '/admin/dashboard'});
  } catch (error) {
    console.error('Trip creation error:', error);
    alert(error?.response?.data?.message || 'Something went wrong.');
  } finally {
    isSubmitting.value = false;
  }
};


const resetForm = () => {
  // Reset all form data
  formData.route = ''
  formData.vehicle = ''
  formData.departureTime = ''
  formData.arrivalTime = ''
  formData.status = 'scheduled'
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

const goBack = () => {
  // In a real app, this would use Vue Router
  console.log('Going back to trips page...')
  alert('Going back to trips page...')
}

onMounted(async() => {
    await fetchRoutes()
    await fetchVehicles()
    console.log('Selected Route:', selectedRoute.value)
    console.log('Selected Vehicle:', selectedVehicle.value)
    console.log('Route type:', selectedVehicle.value.type)
console.log('All vehicle types:', availableVehicles.value.map(v => v.type))

})
</script>

<style scoped>
.add-trip-page {
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
}
</style>