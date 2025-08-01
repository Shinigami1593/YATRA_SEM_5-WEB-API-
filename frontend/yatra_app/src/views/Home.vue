<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Explore Nepal's Travel Routes</h1>
          <p class="hero-subtitle">
            Discover available transportation routes across Nepal. View schedules, 
            check vehicle types, and plan your journey with real-time route information.
          </p>
          <div class="hero-actions">
            <button class="cta-btn primary" @click="viewRouteDetails">
              <i class="bi bi-list-ul"></i>
              <span>Browse All Routes</span>
            </button>
            <button class="cta-btn secondary" @click="navigateToMap">
              <i class="bi bi-map"></i>
              <span>Explore on Map</span>
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="nepal-map-container">
              <MapView 
                v-if="mapLoaded" 
                :routes="routesForMap" 
                :markers="markersForMap" 
                :zoomLevel="12.25" 
                :center="[27.7172, 85.324]" 
              />
              <div v-else class="map-placeholder">
                <i class="bi bi-map"></i>
                <p>Nepal Routes Overview</p>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Route Statistics -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-signpost-2"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalRoutes }}</div>
            <div class="stat-label">Active Routes</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalCities }}</div>
            <div class="stat-label">Cities Connected</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-calendar-event"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalTrips }}</div>
            <div class="stat-label">Daily Trips</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-truck"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ vehicleTypes }}</div>
            <div class="stat-label">Vehicle Types</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Routes -->
    <section class="featured-routes-section">
      <div class="section-header">
        <h2>Popular Routes</h2>
        <p>Most frequently traveled routes across Nepal</p>
      </div>
      
      <div class="routes-grid">
        <div 
          v-for="route in featuredRoutes" 
          :key="route.id"
          class="route-card"
          @click="viewRouteDetails(route)"
        >
          <div class="route-header">
            <div class="route-path">
              <div class="location source">
                <i class="bi bi-geo-alt-fill"></i>
                <span>{{ route.properties.source }}</span>
              </div>
              <div class="route-arrow">
                <i class="bi bi-arrow-right"></i>
              </div>
              <div class="location destination">
                <i class="bi bi-pin-map-fill"></i>
                <span>{{ route.properties.destination }}</span>
              </div>
            </div>
            <div class="route-status">
              <span class="status-badge" :class="route.properties?.status || 'unknown'">
                <i :class="getStatusIcon(route.properties?.status || '')"></i>
                {{ (route.properties?.status || 'unknown').charAt(0).toUpperCase() + (route.properties?.status || 'unknown').slice(1) }}
              </span>
            </div>
          </div>
          
          <div class="route-info">
            <div class="route-meta">
              <div class="meta-item">
                <i class="bi bi-speedometer2"></i>
                <span>{{ route.distance }} km</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-clock"></i>
                <span>{{ route.estimatedDuration }}</span>
              </div>
            </div>
            
            <div class="vehicle-types">
              <div 
                v-for="vehicleType in getUniqueVehicleTypes(route.trips)"
                :key="vehicleType"
                class="vehicle-badge"
              >
                <i :class="getVehicleIcon(vehicleType)"></i>
                <span>{{ vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) }}</span>
              </div>
            </div>
          </div>
          
          <div class="route-actions">
            <button class="action-btn" @click.stop="viewOnMap(route)">
              <i class="bi bi-map"></i>
              <span>View on Map</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="section-footer">
        <button class="view-all-btn" @click="viewRouteDetails">
          <span>View All Routes</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </section>

    <!-- Quick Access -->
    <section class="quick-access-section">
      <div class="section-header">
        <h2>Quick Access</h2>
        <p>Jump to the information you need</p>
      </div>
      
      <div class="quick-access-grid">
        <div class="access-card" @click="viewRouteDetails">
          <div class="access-icon">
            <i class="bi bi-list-ul"></i>
          </div>
          <div class="access-info">
            <h3>Browse Routes</h3>
            <p>View all available routes with detailed trip information and schedules</p>
          </div>
          <div class="access-arrow">
            <i class="bi bi-chevron-right"></i>
          </div>
        </div>
        
        <div class="access-card" @click="navigateToMap">
          <div class="access-icon">
            <i class="bi bi-map"></i>
          </div>
          <div class="access-info">
            <h3>Explore Map</h3>
            <p>Interactive map view to explore routes visually across Nepal</p>
          </div>
          <div class="access-arrow">
            <i class="bi bi-chevron-right"></i>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApiClient } from '@/services/axios.js'  // import your userApiClient
import MapView from '@/components/MapView.vue'


const router = useRouter()

const mapLoaded = ref(false)
const featuredRoutes = ref([])

const totalRoutes = ref(0)
const totalCities = ref(0)
const totalTrips = ref(0)
const vehicleTypes = ref(0)

// const navigateToRoutes = () => router.push('/user/allroutes/')
const navigateToMap = () => router.push('/details-map')
const viewRouteDetails = () => router.push('/user/all-routes')
const viewOnMap = (route) => router.push(`/routes-map?route=${route.id}`)

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

const getUniqueVehicleTypes = (trips) => {
  if (!Array.isArray(trips)) return []
  return [...new Set(trips.map(trip => trip.vehicleType))]
}


const loadNepalMap = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  mapLoaded.value = true
}

const fetchRoutesData = async () => {
  try {
    const response = await userApiClient.get('/routes')
    const data = response.data.routes || []

    featuredRoutes.value = data

    totalRoutes.value = data.length
    const allCities = new Set()
    const vehiclesSet = new Set()

    data.forEach(route => {
      if (route.properties?.source) allCities.add(route.properties.source)
      if (route.properties?.destination) allCities.add(route.properties.destination)
      if (route.properties?.type) vehiclesSet.add(route.properties.type) 
      
      console.log(route.properties)// vehicle type: bus, tempo, etc
    })

    totalCities.value = allCities.size
    vehicleTypes.value = vehiclesSet.size


    // Since no trips data, you can set totalTrips to 0 or remove it
    totalTrips.value = 0
  } catch (error) {
    console.error('Error fetching routes:', error)
    featuredRoutes.value = []
  }
}


// Compute routes in format expected by MapView
const routesForMap = computed(() => {
  return featuredRoutes.value.map(route => ({
    geometry: {
      // Make sure your backend provides coordinates in [lon, lat] pairs
      coordinates: route.coordinates || []
    }
  }))
})

// Optional markers for source and destination locations on the map
const markersForMap = computed(() => {
  const markers = []
  featuredRoutes.value.forEach(route => {
    if (route.sourceCoordinates) {
      markers.push({ lat: route.sourceCoordinates[1], lon: route.sourceCoordinates[0], popup: route.source })
    }
    if (route.destinationCoordinates) {
      markers.push({ lat: route.destinationCoordinates[1], lon: route.destinationCoordinates[0], popup: route.destination })
    }
  })
  return markers
})


onMounted(() => {
  loadNepalMap()
  fetchRoutesData()
})
</script>



<style scoped>
.home-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 4rem 2rem;
  border-bottom: 1px solid #333333;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  color: #00D664;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.hero-subtitle {
  color: #a0a0a0;
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.cta-btn.primary {
  background: #00D664;
  color: #000000;
}

.cta-btn.primary:hover {
  background: #00b854;
  transform: translateY(-2px);
}

.cta-btn.secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid #555555;
}

.cta-btn.secondary:hover {
  border-color: #00D664;
  color: #00D664;
  transform: translateY(-2px);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nepal-map-container {
  width: 100%;
  max-width: 100%;
  height: 300px;
  position: relative;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.map-placeholder {
  text-align: center;
  color: #a0a0a0;
}

.map-placeholder i {
  font-size: 4rem;
  color: #00D664;
  margin-bottom: 1rem;
}

.nepal-overview-map {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

/* Stats Section */
.stats-section {
  padding: 3rem 2rem;
  background: #0f0f0f;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #00D664;
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 214, 100, 0.2);
  border-radius: 12px;
}

.stat-icon i {
  font-size: 1.8rem;
  color: #00D664;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #a0a0a0;
  font-size: 1rem;
}

/* Featured Routes Section */
.featured-routes-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 3rem auto;
  text-align: center;
}

.section-header h2 {
  color: #00D664;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.section-header p {
  color: #a0a0a0;
  font-size: 1.1rem;
}

.routes-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.route-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.route-card:hover {
  border-color: #00D664;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 214, 100, 0.1);
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.route-path {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.location.source {
  color: #27ae60;
}

.location.destination {
  color: #e74c3c;
}

.route-arrow {
  color: #00D664;
  font-size: 1.2rem;
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

.status-badge.active {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
  border: 1px solid #27ae60;
}

.status-badge.maintenance {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 1px solid #f39c12;
}

.route-info {
  margin-bottom: 1.5rem;
}

.route-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
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

.vehicle-types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.vehicle-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 214, 100, 0.2);
  color: #00D664;
  border: 1px solid #00D664;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.route-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: auto;
  padding: 0.5rem 1rem;
  background: #333333;
  color: #ffffff;
  border: 1px solid #555555;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #444444;
  border-color: #00D664;
}

.section-footer {
  max-width: 1200px;
  margin: 3rem auto 0 auto;
  text-align: center;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: #00D664;
  border: 2px solid #00D664;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #00D664;
  color: #000000;
}

/* Quick Access Section */
.quick-access-section {
  padding: 4rem 2rem;
  background: #0f0f0f;
}

.quick-access-grid {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.access-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.access-card:hover {
  border-color: #00D664;
  transform: translateY(-2px);
}

.access-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 214, 100, 0.2);
  border-radius: 12px;
  flex-shrink: 0;
}

.access-icon i {
  font-size: 1.8rem;
  color: #00D664;
}

.access-info {
  flex: 1;
}

.access-info h3 {
  color: #ffffff;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
}

.access-info p {
  color: #a0a0a0;
  margin: 0;
  line-height: 1.5;
}

.access-arrow {
  color: #555555;
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .routes-grid {
    grid-template-columns: 1fr;
  }
  
  .route-path {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .route-arrow {
    transform: rotate(90deg);
  }
  
  .quick-access-grid {
    grid-template-columns: 1fr;
  }
  
  .access-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-section,
  .stats-section,
  .featured-routes-section,
  .quick-access-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .route-card {
    padding: 1rem;
  }
  
  .route-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .route-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>