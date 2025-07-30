<template>
  <div class="routes-list-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1>Travel Routes</h1>
          <p>Explore available routes and trip schedules across Nepal</p>
        </div>
        
        <div class="header-actions">
          <!-- <div class="search-container">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search routes or destinations..."
                class="search-input"
              >
            </div>
          </div> -->
          
          <div class="filter-container">
            <select v-model="selectedVehicleType" class="filter-select">
              <option value="">All Vehicles</option>
              <option value="bus">Bus</option>
              <option value="micro">Micro</option>
              <option value="tempo">Tempo</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split spinning"></i>
        <p>Loading routes...</p>
      </div>
    </div>

    <!-- Routes Container -->
    <div v-else class="routes-container">
      <div class="routes-grid">
        <div 
          v-for="route in filteredRoutes"
          :key="route.id" 
          class="route-card"
        >
          <!-- Route Header -->
          <div class="route-header">
            <div class="route-main-info">
              <div class="route-title-section">
                <h3 class="route-name">{{ route.properties.name }}</h3>
                <div class="route-badges">
                  <span class="status-badge" :class="route.properties.status">
                    <i :class="getStatusIcon(route.properties.status)"></i>
                    {{ route.properties.status.charAt(0).toUpperCase() + route.properties.status.slice(1) }}
                  </span>
                  
                  <span class="route-type" :class="route.properties.type">
                    <i :class="getVehicleIcon(route.properties.type)"></i>
                    {{ route.properties.type.toUpperCase() }}
                  </span>
                </div>
              </div>
              
              <div class="route-path">
                <div class="location-badge source">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span>{{ route.properties.source }}</span>
                </div>
                
                <div class="route-arrow">
                  <div class="arrow-line"></div>
                  <i class="bi bi-arrow-right"></i>
                  <div class="arrow-line"></div>
                </div>
                
                <div class="location-badge destination">
                  <i class="bi bi-pin-map-fill"></i>
                  <span>{{ route.properties.destination }}</span>
                </div>
              </div>
            </div>
            
            <!-- <div class="route-actions">
              <button class="action-btn primary">
                <i class="bi bi-eye"></i>
                View Details
              </button>
            </div> -->
          </div>

          <!-- Route Stats -->

        </div>
      </div>

      <!-- Empty State for Routes -->
      <div v-if="filteredRoutes.length === 0" class="empty-routes">
        <div class="empty-content">
          <i class="bi bi-map"></i>
          <h3>No routes found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>

    <!-- Map Modal -->
    <div v-if="showMapModal" class="map-modal-overlay" @click="closeMapModal">
      <div class="map-modal" @click.stop>
        <div class="map-header">
          <h3>Route Map: {{ selectedRoute?.source }} → {{ selectedRoute?.destination }}</h3>
          <button class="close-btn" @click="closeMapModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="map-placeholder">
          <i class="bi bi-map"></i>
          <p>Map integration with OpenRouteService will be implemented here</p>
          
          <div class="map-info">
            <div class="info-item">
              <strong>Distance:</strong> {{ selectedRoute?.distance }} km
            </div>
            <div class="info-item">
              <strong>Estimated Duration:</strong> {{ selectedRoute?.estimatedDuration }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { userApiClient } from '@/services/axios' // Moved import to top level

// Reactive data
const loading = ref(true)
const searchSource = ref('')
const searchDestination = ref('')
const selectedVehicleType = ref('')
const routes = ref([])

// Fetch routes from API
const fetchRoutes = async () => {
  try {
    loading.value = true
    const response = await userApiClient.get('/routes')
    routes.value = response.data.routes
  } catch (error) {
    console.error('Error fetching routes:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredRoutes = computed(() => {
  let filtered = routes.value

  // Filter by source
  if (searchSource.value) {
    const query = searchSource.value.toLowerCase()
    filtered = filtered.filter(route => 
      route.properties.source.toLowerCase().includes(query)
    )
  }

  // Filter by destination
  if (searchDestination.value) {
    const query = searchDestination.value.toLowerCase()
    filtered = filtered.filter(route => 
      route.properties.destination.toLowerCase().includes(query)
    )
  }

  // Filter by vehicle type
  if (selectedVehicleType.value) {
    filtered = filtered.filter(route => 
      route.properties.type === selectedVehicleType.value
    )
  }

  return filtered
})

// Methods
const getStatusIcon = (status) => {
  const icons = {
    active: 'bi bi-check-circle',
    maintenance: 'bi bi-tools',
    inactive: 'bi bi-x-circle'
  }
  return icons[status] || 'bi bi-question-circle'
}

const getVehicleIcon = (vehicleType) => {
  const icons = {
    bus: 'bi bi-bus-front',
    micro: 'bi bi-truck',
    tempo: 'bi bi-car-front'
  }
  return icons[vehicleType] || 'bi bi-question-circle'
}

// Lifecycle
onMounted(() => {
  fetchRoutes()
})
</script>

<style scoped>
/* Import Bootstrap Icons */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css');

/* Base Styles */
.routes-list-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Section */
.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom: 1px solid #333333;
  padding: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-info h1 {
  color: #00D664;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-info p {
  color: #a0a0a0;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

/* Search Container */
.search-container {
  flex: 1;
  min-width: 300px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: #a0a0a0;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

.search-input::placeholder {
  color: #a0a0a0;
}

/* Filter Container */
.filter-container {
  min-width: 150px;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  background: #333333;
  border: 1px solid #555555;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

/* Routes Container */
.routes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

/* Route Card - Compact Design */
.route-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.route-card:hover {
  border-color: #00D664;
  box-shadow: 0 8px 25px rgba(0, 214, 100, 0.15);
  transform: translateY(-3px);
}

/* Route Header - Compact */
.route-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid #333333;
}

.route-main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.route-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.route-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.route-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Route Path - Compact */
.route-path {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.location-badge.source {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
  border: 1px solid rgba(39, 174, 96, 0.4);
}

.location-badge.destination {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
}

.route-arrow {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #00D664;
  font-size: 0.9rem;
  /* width: 50%; */
}

.arrow-line {
  width:50px;
  height: 1px;
  background: #00D664;
}

/* Route Actions - Compact */
.route-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 100px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-btn.primary {
  background: #00D664;
  color: #000000;
}

.action-btn.primary:hover {
  background: #00b854;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: transparent;
  color: #a0a0a0;
  border: 1px solid #444444;
}

.action-btn.secondary:hover {
  background: #333333;
  color: #ffffff;
  border-color: #555555;
}

/* Status Badges - Compact */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-badge.active {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
  border: 1px solid rgba(39, 174, 96, 0.4);
}

.status-badge.maintenance {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 1px solid rgba(243, 156, 18, 0.4);
}

.status-badge.inactive {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
}

.route-type {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(0, 214, 100, 0.2);
  color: #00D664;
  border: 1px solid rgba(0, 214, 100, 0.4);
  transition: all 0.3s ease;
}

/* Route Stats - New Compact Section */
.route-stats {
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.stat-item i {
  color: #00D664;
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-label {
  color: #a0a0a0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

.stat-value {
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
}

/* Empty State */
.empty-routes {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  grid-column: 1 / -1;
}

.empty-content {
  text-align: center;
  color: #a0a0a0;
  padding: 2rem;
}

.empty-content i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #555555;
}

.empty-content h3 {
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-content p {
  font-size: 1rem;
  line-height: 1.6;
}

/* Map Modal */
.map-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(4px);
}

.map-modal {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.map-header {
  padding: 1.5rem;
  border-bottom: 1px solid #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-header h3 {
  color: #ffffff;
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: #333333;
  border: 1px solid #555555;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #444444;
  transform: scale(1.05);
}

.map-placeholder {
  padding: 3rem;
  text-align: center;
  color: #a0a0a0;
}

.map-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #00D664;
}

.map-placeholder p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.map-info {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.info-item {
  color: #ffffff;
  font-size: 0.95rem;
}

/* Animations */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .routes-grid {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .header-info h1 {
    font-size: 2rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .search-container {
    min-width: auto;
  }

  .routes-container {
    padding: 1rem;
  }

  .routes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .route-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .route-actions {
    flex-direction: row;
    min-width: auto;
  }

  .route-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .route-path {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .route-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .map-modal-overlay {
    padding: 1rem;
  }

  .map-header {
    padding: 1rem;
  }

  .map-placeholder {
    padding: 2rem 1rem;
  }

  .map-info {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .header-info h1 {
    font-size: 1.75rem;
  }

  .location-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .route-name {
    font-size: 1rem;
  }

  .route-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .stat-item {
    gap: 0.5rem;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }

  .empty-content i {
    font-size: 3rem;
  }

  .empty-content h3 {
    font-size: 1.25rem;
  }
}

/* Focus States */
.search-input:focus,
.filter-select:focus {
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

/* Hover Effects */
.route-card:hover .location-badge {
  transform: translateY(-1px);
}

.route-card:hover .status-badge,
.route-card:hover .route-type {
  transform: scale(1.02);
}

.route-card:hover .stat-item i {
  transform: scale(1.1);
}

/* Scrollbar Styling */
.map-modal::-webkit-scrollbar {
  width: 8px;
}

.map-modal::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.map-modal::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 4px;
}

.map-modal::-webkit-scrollbar-thumb:hover {
  background: #444444;
}
</style>