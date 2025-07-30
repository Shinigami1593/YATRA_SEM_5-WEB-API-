<template>
  <div class="trips-tab">
    <!-- Admin Header -->
    <div class="addtrip">
      <router-link to="/admin/add-trip" style="text-decoration: none;">
        <button class="admin-btn primary">
          <i class="bi bi-plus-circle"></i>
          Add New Trip
        </button>
      </router-link>
      <br>
    </div>
    <!-- Admin Stats -->
    <div class="admin-stats">
      <div class="stat-card">
        <div class="stat-icon scheduled">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ tripStats.scheduled }}</div>
          <div class="stat-label">Scheduled</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ tripStats.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon cancelled">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ tripStats.cancelled }}</div>
          <div class="stat-label">Cancelled</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="bi bi-calendar-check"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ tripStats.total }}</div>
          <div class="stat-label">Total Trips</div>
        </div>
      </div>
    </div>

    <!-- Admin Controls -->
    <div class="admin-controls">
      
      
      <div class="controls-right">
        <div class="filter-controls main">
          <div class="filter-controls filter">
            <select v-model="statusFilter" class="admin-select">
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            
            <select v-model="typeFilter" class="admin-select">
              <option value="">All Types</option>
              <option value="bus">Bus</option>
              <option value="micro">Micro</option>
              <option value="tempo">Tempo</option>
            </select>
          </div>
          
          <div class="search-container">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search routes, locations..." 
              class="admin-search"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Trip Management Grid -->
    <div class="admin-trips-grid">
      <div 
        class="admin-trip-card" 
        v-for="trip in filteredTrips" 
        :key="trip._id"
        
      >
        <!-- Trip Header -->
        <div class="admin-trip-header">
          <div class="trip-id">
            <span class="id-label">Trip ID:</span>
            <span class="id-value">{{ trip._id.slice(-8) }}</span>
          </div>
          <div class="trip-badges">
            <div class="trip-type" :class="trip.route.type">
              <i :class="getTypeIcon(trip.vehicle.type)"></i>
              <span>{{ trip.vehicle.type }}</span>
            </div>
            <div class="trip-status" :class="trip.status">
              <i :class="getStatusIcon(trip.status)"></i>
              {{ trip.status.charAt(0).toUpperCase() + trip.status.slice(1) }}
            </div>
          </div>
        </div>

        <!-- Trip Content -->
        <div class="admin-trip-content">
          <h4 class="route-name">{{ trip.route.name }}</h4>
          
          <!-- Route Information -->
          <div class="route-section">
            <div class="section-title">
              <i class="bi bi-map"></i>
              Route Details
            </div>
            <div class="route-path">
              <div class="location-row">
                <i class="bi bi-geo-alt-fill source-icon"></i>
                <div class="location-details">
                  <span class="location-label">From:</span>
                  <span class="location-name">{{ trip.route.source }}</span>
                </div>
              </div>
              <div class="path-divider">
                <div class="divider-line"></div>
                <i class="bi bi-arrow-down"></i>
              </div>
              <div class="location-row">
                <i class="bi bi-pin-map-fill destination-icon"></i>
                <div class="location-details">
                  <span class="location-label">To:</span>
                  <span class="location-name">{{ trip.route.destination }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Information -->
          <div class="schedule-section">
            <div class="section-title">
              <i class="bi bi-clock"></i>
              Schedule
            </div>
            <div class="schedule-grid">
              <div class="schedule-item">
                <div class="schedule-label">Departure</div>
                <div class="schedule-time">{{ trip.departureTime }}</div>
              </div>
              <div class="schedule-arrow">→</div>
              <div class="schedule-item">
                <div class="schedule-label">Arrival</div>
                <div class="schedule-time">{{ trip.arrivalTime }}</div>
              </div>
              <div class="schedule-duration">
                <i class="bi bi-hourglass-split"></i>
                <span>{{ calculateDuration(trip.departureTime, trip.arrivalTime) }}</span>
              </div>
            </div>
          </div>

          <!-- Vehicle & Admin Info -->
          <div class="admin-info-grid">
            <div class="info-item">
              <div class="info-label">Vehicle</div>
              <div class="info-value">
                <i :class="getTypeIcon(trip.vehicle.type)"></i>
                {{ trip.vehicle.type }} - {{ trip.vehicle._id.slice(-6) }}
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-label">Created</div>
              <div class="info-value">{{ formatDate(trip.createdAt) }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">Route Status</div>
              <div class="info-value">
                <span class="route-status" :class="trip.route.status">
                  {{ trip.route.status }}
                </span>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-label">Last Updated</div>
              <div class="info-value">{{ formatDate(trip.updatedAt || trip.createdAt) }}</div>
            </div>
          </div>
        </div>

        <!-- Admin Actions -->
        <div class="admin-trip-actions">
          <div class="action-group primary-actions">
            <router-link :to="`/admin/edit-trip/${trip._id}`">
              <button class="action-btn edit" @click="editTrip(trip._id)">
                <i class="bi bi-pencil"></i>
                Edit
              </button>
            </router-link>
          </div>
          
          <div class="action-group status-actions" v-if="trip.status === 'scheduled'">
            <button class="action-btn complete" @click="updateTripStatus(trip._id, 'completed')">
              <i class="bi bi-check-circle"></i>
              Complete
            </button>
            <button class="action-btn cancel" @click="updateTripStatus(trip._id, 'cancelled')">
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>
          </div>
          
          <div class="action-group danger-actions">
            <button class="action-btn delete" @click="deleteTrip(trip._id)">
              <i class="bi bi-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Empty State -->
    <div v-if="filteredTrips.length === 0" class="admin-empty-state">
      <div class="empty-icon">
        <i class="bi bi-calendar-x"></i>
      </div>
      <h3>No trips found</h3>
      <p v-if="searchQuery || statusFilter || typeFilter || dateFilter">
        No trips match your current filters. Try adjusting your search criteria.
      </p>
      <p v-else>
        No trip schedules have been created yet. Create your first trip to get started.
      </p>
      <router-link to="/admin/add-trip" style="text-decoration: none;">
        <button class="admin-btn primary">
          <i class="bi bi-plus-circle"></i>
          Create First Trip
        </button>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="admin-loading-state">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split spinning"></i>
      </div>
      <p>Loading trip schedules...</p>
    </div>
  </div>
</template>

<script setup>
import { adminApiClient, tripApiClient, userApiClient, vehicleApiClient } from '@/services/axios'
import { ref, reactive, computed, onMounted } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css';


// Reactive data
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFilter = ref('')
const selectedTrips = ref([])
const selectAll = ref(false)

const trips= ref([])

// Mock trip data with admin-focused information
const fetchTrips = async () => {
  try {
    loading.value = true
    const res = await tripApiClient.get('/') // GET all trips
    const rawTrips = res.data.trips || []


    const populatedTrips = rawTrips.map((trip) => ({
      ...trip,
      _id: trip._id?.$oid || trip._id, // Just in case
      createdAt: trip.createdAt?.$date || trip.createdAt,
      route: trip.route, // Already an object
      vehicle: trip.vehicle, // Already an object
    }))

    // console.log(populatedTrips)

    trips.value = populatedTrips
  } catch (err) {
    console.error('Error fetching trips:', err)
  } finally {
    loading.value = false
  }
}



// Computed properties
const tripStats = computed(() => {
  const stats = {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    total: trips.value.length
  }
  
  trips.value.forEach(trip => {
    stats[trip.status]++
  })
  
  return stats
})

const filteredTrips = computed(() => {
  let filtered = trips.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(trip => 
      trip.route.name.toLowerCase().includes(query) ||
      trip.route.source.toLowerCase().includes(query) ||
      trip.route.destination.toLowerCase().includes(query) ||
      trip._id.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(trip => trip.status === statusFilter.value)
  }

  // Filter by type
  if (typeFilter.value) {
    filtered = filtered.filter(trip => trip.route.type === typeFilter.value)
  }

  // Filter by date (simplified for demo)
  if (dateFilter.value) {
    // In real app, implement proper date filtering
    console.log('Date filter:', dateFilter.value)
  }

  return filtered
})

// Methods
const getTypeIcon = (type) => {
  const icons = {
    Bus: 'bi bi-bus-front',
    Micro: 'bi bi-truck',
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

const calculateDuration = (departureTime, arrivalTime) => {
  const [depHour, depMin] = departureTime.split(':').map(Number)
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number)
  
  let depMinutes = depHour * 60 + depMin
  let arrMinutes = arrHour * 60 + arrMin
  
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60
  }
  
  const diffMinutes = arrMinutes - depMinutes
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Admin Actions
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTrips.value = filteredTrips.value.map(trip => trip._id)
  } else {
    selectedTrips.value = []
  }
}

const bulkUpdateStatus = (newStatus) => {
  if (confirm(`Are you sure you want to ${newStatus} ${selectedTrips.value.length} selected trips?`)) {
    selectedTrips.value.forEach(tripId => {
      const trip = trips.value.find(t => t._id === tripId)
      if (trip) {
        trip.status = newStatus
        trip.updatedAt = new Date().toISOString()
      }
    })
    selectedTrips.value = []
    selectAll.value = false
    console.log(`Bulk updated ${selectedTrips.value.length} trips to ${newStatus}`)
  }
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedTrips.value.length} selected trips? This action cannot be undone.`)) {
    selectedTrips.value.forEach(tripId => {
      const index = trips.value.findIndex(t => t._id === tripId)
      if (index > -1) {
        trips.value.splice(index, 1)
      }
    })
    selectedTrips.value = []
    selectAll.value = false
    console.log('Bulk deleted selected trips')
  }
}

const editTrip = (tripId) => {
  console.log('Edit trip:', tripId)
  // Navigate to edit page
  alert(`Edit trip: ${tripId}`)
}


const deleteTrip = async (tripId) => {
  if (!confirm('Are you sure you want to delete this trip?')) return

  try {
    await tripApiClient.delete(`/admin/${tripId}`)
    trips.value = trips.value.filter(trip => trip._id !== tripId)
    console.log('Deleted trip:', tripId)
  } catch (err) {
    console.error('Error deleting trip:', err)
    alert('Failed to delete trip.')
  }
}

const updateTripStatus = (tripId, newStatus) => {
  const trip = trips.value.find(trip => trip._id === tripId)
  if (trip) {
    trip.status = newStatus
    trip.updatedAt = new Date().toISOString()
    console.log(`Trip ${tripId} status updated to: ${newStatus}`)
  }
}

const exportTrips = () => {
  console.log('Exporting trips data...')
  // Implement CSV/Excel export
  alert('Trip data exported successfully!')
}

// Lifecycle
onMounted(() => {
    fetchTrips()
  console.log('Admin TripsTab mounted')
})
</script>

<style scoped>
.trips-tab {
  padding: 0;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #333333;
}

.header-left h3 {
  color: #00D664;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-subtitle {
  color: #a0a0a0;
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.admin-btn {
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

.admin-btn.primary {
  background: #00D664;
  color: #000000;
}

.addtrip{
  width: 100%;
  height: 62px;
  display: flex;
  justify-content: end;
}

.admin-btn.secondary {
  background: #333333;
  color: #ffffff;
  border: 1px solid #555555;
}

.admin-btn:hover {
  transform: translateY(-1px);
}

.admin-btn.primary:hover {
  background: #00b854;
}

.admin-btn.secondary:hover {
  background: #444444;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.scheduled {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.stat-icon.completed {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.stat-icon.cancelled {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.stat-icon.total {
  background: rgba(0, 214, 100, 0.2);
  color: #00D664;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.admin-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 1rem;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.bulk-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #00D664;
}

.bulk-label {
  color: #ffffff;
  font-weight: 500;
}

.bulk-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bulk-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.bulk-btn.complete {
  background: #27ae60;
  color: #ffffff;
}

.bulk-btn.cancel {
  background: #f39c12;
  color: #ffffff;
}

.bulk-btn.delete {
  background: #e74c3c;
  color: #ffffff;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  width: max-content;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.filter-controls.main{
  gap: 880px;
}
.admin-controls{
  display: flex;
  justify-content: space-evenly;
}

.admin-select {
  padding: 0.5rem 0.75rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 120px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-container i {
  position: absolute;
  left: 0.75rem;
  color: #a0a0a0;
}

.admin-search {
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 250px;
}

.admin-trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
}

.admin-trip-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #333333;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
}

.admin-trip-card:hover {
  border-color: #00D664;
  transform: translateY(-2px);
}

.admin-trip-card.selected {
  border-color: #00D664;
  background: linear-gradient(135deg, #2a3a2a 0%, #1a2a1a 100%);
}

.trip-selection {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.trip-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #00D664;
}

.admin-trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
}

.trip-id {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.id-label {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.id-value {
  color: #00D664;
  font-family: monospace;
  font-weight: 600;
}

.trip-badges {
  display: flex;
  gap: 0.5rem;
}

.trip-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.trip-type.bus {
  background: #3498db;
  color: #ffffff;
}

.trip-type.micro {
  background: #f39c12;
  color: #ffffff;
}

.trip-type.tempo {
  background: #9b59b6;
  color: #ffffff;
}

.trip-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.trip-status.scheduled {
  background: #27ae60;
  color: #ffffff;
}

.trip-status.cancelled {
  background: #e74c3c;
  color: #ffffff;
}

.trip-status.completed {
  background: #3498db;
  color: #ffffff;
}

.route-name {
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.route-section,
.schedule-section {
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00D664;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.route-path {
  background: #333333;
  border-radius: 8px;
  padding: 1rem;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.location-row:last-child {
  margin-bottom: 0;
}

.source-icon {
  color: #27ae60;
  font-size: 1.2rem;
}

.destination-icon {
  color: #e74c3c;
  font-size: 1.2rem;
}

.location-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-label {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.location-name {
  color: #ffffff;
  font-weight: 500;
}

.path-divider {
  display: flex;
  align-items: center;
  margin: 0.5rem 0 0.5rem 1.6rem;
}

.divider-line {
  width: 2px;
  height: 20px;
  background: #555555;
  margin-right: 1rem;
}

.path-divider i {
  color: #00D664;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: 1rem;
  align-items: center;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 1rem;
}

.schedule-item {
  text-align: center;
}

.schedule-label {
  color: #a0a0a0;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.schedule-time {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
}

.schedule-arrow {
  color: #00D664;
  font-weight: bold;
  font-size: 1.2rem;
}

.schedule-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00D664;
  font-weight: 500;
  justify-content: center;
}

.admin-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  background: #333333;
  border-radius: 6px;
  padding: 0.75rem;
}

.info-label {
  color: #a0a0a0;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.info-value {
  color: #ffffff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.route-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.route-status.active {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.route-status.inactive {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.admin-trip-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
}

.action-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  width: auto;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: #00D664;
  color: #000000;
}

.action-btn.view {
  background: #3498db;
  color: #ffffff;
}

.action-btn.complete {
  background: #27ae60;
  color: #ffffff;
}

.action-btn.cancel {
  background: #f39c12;
  color: #ffffff;
}

.action-btn.delete {
  background: #e74c3c;
  color: #ffffff;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.admin-empty-state,
.admin-loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #a0a0a0;
}

.empty-icon,
.loading-spinner {
  font-size: 4rem;
  color: #555555;
  margin-bottom: 1.5rem;
}

.admin-empty-state h3 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.admin-empty-state p {
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-trips-grid {
    grid-template-columns: 1fr;
  }

  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .admin-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: stretch;
  }

  .admin-select,
  .admin-search {
    min-width: auto;
    flex: 1;
  }

  .schedule-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .schedule-arrow {
    transform: rotate(90deg);
  }

  .admin-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>