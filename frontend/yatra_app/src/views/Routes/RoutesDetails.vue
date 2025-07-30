<template>
  <div class="routes-page">
    <div class="header">
      <h1>Routes Map</h1>
      <p>Explore travel routes and trips across Nepal</p>
      <div class="controls">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="searchQuery" placeholder="Search routes or cities..." class="search-input" />
        </div>
        <select v-model="selectedVehicleType" class="filter-select">
          <option value="">All Vehicles</option>
          <option value="bus">Bus</option>
          <option value="micro">Micro</option>
          <option value="tempo">Tempo</option>
        </select>
      </div>
    </div>

    <div class="main-content">
      <div class="map-section">
        <div class="map-header">
          <div>
            <h2>Interactive Routes</h2>
            <span>{{ filteredRoutes.length }} routes</span>
          </div>
          <div class="map-controls">
            <button @click="refreshMap" :disabled="isLoadingMap" class="control-btn">
              <i class="bi bi-arrow-repeat" :class="{ 'spinning': isLoadingMap }"></i> Refresh
            </button>
            <!-- <button @click="toggleFullscreen" class="control-btn">
              <i class="bi bi-fullscreen"></i> Fullscreen
            </button>
            <button @click="centerMap" class="control-btn">
              <i class="bi bi-geo-alt-fill"></i> Center
            </button> -->
          </div>
        </div>
        <div class="map-container" ref="mapContainer">
          <div v-if="isLoadingMap" class="map-loading">
            <i class="bi bi-arrow-repeat spinning"></i>
            <p>Loading map...</p>
          </div>
          <div v-else-if="mapError" class="map-error">
            <i class="bi bi-exclamation-triangle"></i>
            <h3>Map Error</h3>
            <p>{{ mapError }}</p>
            <button @click="loadMap" class="retry-btn">Try Again</button>
          </div>
          <MapView
            v-else
            :routes="filteredRoutes"
            @routeClick="handleRouteClick"
            :center="mapCenter"
            :zoom="mapZoom"
            :interactive="true"
          />
        </div>
      </div>

      <div class="trip-panel">
        <div class="trip-details">
          <div class="trip-header">
            <h2>Available Trips</h2>
            <button v-if="selectedRoute" @click="clearSelection" class="close-btn">
              <i class="bi bi-x"></i> Clear Route
            </button>
          </div>
          <div class="trips-section">
            <span>{{ filteredTrips.length }} trips</span>
            <div class="trips-list">
              <div v-if="!filteredTrips.length" class="no-trips">
                <i class="bi bi-calendar-x"></i>
                <p>No trips available</p>
              </div>
              <div v-for="trip in filteredTrips" :key="trip._id" class="trip-item" :class="{ 'past': isPastTrip(trip.departureTime) }">
                <div class="trip-route">
                  <span class="source">{{ trip.route.source }}</span>
                  <i class="bi bi-arrow-right"></i>
                  <span class="destination">{{ trip.route.destination }}</span>
                </div>
                <div class="trip-time">
                  <div>
                    <span class="time">{{ formatTime(trip.departureTime) }}</span>
                    <!-- <span class="date">{{ formatDate(trip.departureTime) }}</span> -->
                  </div>
                  <div class="duration-line">
                    <div class="line"></div>
                    <span>{{ trip.duration || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="time">{{ formatTime(trip.arrivalTime) }}</span>
                    <!-- <span class="date">{{ formatDate(trip.arrivalTime) }}</span> -->
                  </div>
                </div>
                <div class="trip-info">
                  <div>
                    <i :class="getVehicleIcon(trip.vehicle.type)"></i>
                    <span>{{ trip.vehicle.type }}</span>
                  </div>
                  <span class="status-badge" :class="trip.status">{{ trip.status.charAt(0).toUpperCase() + trip.status.slice(1) }}</span>
                </div>
                <!-- <button
                  @click="selectTrip(trip)"
                  :disabled="trip.status !== 'scheduled' || isPastTrip(trip.departureTime)"
                  class="action-btn"
                >
                  {{ trip.status === 'scheduled' && !isPastTrip(trip.departureTime) ? 'Select Trip' : 'Unavailable' }}
                </button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import MapView from '@/components/MapView.vue'
import { tripApiClient, userApiClient } from '@/services/axios'
import { Fullscreen } from 'lucide-vue-next'

const mapContainer = ref(null)
const mapId = 'routes-map'
const isLoadingMap = ref(false)
const mapError = ref(null)
const selectedRoute = ref(null)
const searchQuery = ref('')
const selectedVehicleType = ref('')
const mapCenter = ref([27.709031, 85.313118])
const mapZoom = ref(13)
const routes = ref([])
const trips = ref([])
const tripCache = new Map()
const isFullscreen = ref(false)

const handleRouteClick = (route) => {
  if (selectedRoute.value?.properties.id === route.properties.id) return
  selectedRoute.value = {
    ...route,
    trips: getTripsForRoute(route)
  }
  console.log('Selected route:', route.properties.id, 'Trips:', selectedRoute.value.trips)
  if (route.geometry?.coordinates?.length) {
    mapCenter.value = [route.geometry.coordinates[0][1], route.geometry.coordinates[0][0]]
    mapZoom.value = 14
  }
}

const fetchData = async () => {
  isLoadingMap.value = true
  try {
    const [routesRes, tripsRes] = await Promise.all([
      userApiClient.get('/routes'),
      tripApiClient.get('/')
    ])
    const rawRoutes = routesRes.data.routes || []
    trips.value = tripsRes.data.trips || []

    // Fetch road-optimized routes
    routes.value = await Promise.all(rawRoutes.map(async route => {
      const start = route.geometry.coordinates[0] // [lng, lat]
      const end = [85.333, 27.7102] // Example end point, adjust based on destination
      const roadRoute = await getRoadRoute(start, end)
      return {
        ...route,
        geometry: {
          type: "LineString",
          coordinates: roadRoute
        }
      }
    }))

    console.log('Fetched routes:', routes.value.map(r => r.properties?.id))
    console.log('Fetched trips:', trips.value)
    await nextTick()
  } catch (error) {
    console.error('Fetch error:', error)
    mapError.value = 'Failed to load data. Please try again.'
  } finally {
    isLoadingMap.value = false
  }
}

// Function to get road route from OpenRouteService
const getRoadRoute = async (start, end) => {
  const apiKey = '536b1aa1ad27498994308171ca7d0a55' // Replace with your OpenRouteService API key
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.features && data.features.length) {
      return data.features[0].geometry.coordinates // Returns [ [lng, lat], ... ]
    }
    throw new Error('No route found')
  } catch (error) {
    console.error('Routing error:', error)
    return [start, end] // Fallback to straight line if API fails
  }
}

const filteredRoutes = computed(() => {
  let filtered = routes.value
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(route => {
      const { source, destination, name } = route.properties || {}
      return (
        source?.toLowerCase().includes(query) ||
        destination?.toLowerCase().includes(query) ||
        name?.toLowerCase().includes(query)
      )
    })
  }
  if (selectedVehicleType.value) {
    filtered = filtered.filter(route => {
      const matchesPrimary = route.properties?.type?.toLowerCase() === selectedVehicleType.value
      const routeTrips = getTripsForRoute(route)
      const matchesTrip = routeTrips.some(trip => trip.vehicle?.type?.toLowerCase() === selectedVehicleType.value)
      return matchesPrimary || matchesTrip
    })
  }
  console.log('Filtered routes:', filtered.map(r => r.properties?.id))
  return filtered
})

const filteredTrips = computed(() => {
  let filtered = selectedRoute.value ? selectedRoute.value.trips : trips.value
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(trip => {
      const { source, destination, name } = trip.route || {}
      return (
        source?.toLowerCase().includes(query) ||
        destination?.toLowerCase().includes(query) ||
        name?.toLowerCase().includes(query)
      )
    })
  }
  if (selectedVehicleType.value) {
    filtered = filtered.filter(trip => trip.vehicle?.type?.toLowerCase() === selectedVehicleType.value)
  }
  return filtered
})

const getTripsForRoute = (route) => {
  const routeId = route.properties?.id
  if (tripCache.has(routeId)) return tripCache.get(routeId)
  const routeTrips = trips.value.filter(trip => trip.route?._id === routeId)
  tripCache.set(routeId, routeTrips)
  console.log(`Trips for route ${routeId}:`, routeTrips)
  return routeTrips
}

const getVehicleIcon = (vehicleType) => {
  const icons = {
    Bus: 'bi bi-bus-front',
    Micro: 'bi bi-truck-front',
    Tempo: 'bi bi-car-front'
  }
  return icons[vehicleType] || 'bi bi-question-circle'
}

const formatTime = (time) => {
  if (!time) return 'N/A'
  return new Date(`2025-07-21T${time}:00+05:45`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const formatDate = (time) => {
  if (!time) return 'N/A'
  return new Date(`2025-07-21T${time}:00+05:45`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const isPastTrip = (time) => {
  if (!time) return true
  return new Date(`2025-07-21T${time}:00+05:45`) < new Date()
}

const selectTrip = (trip) => {
  alert(`Trip selected: ${trip.vehicle?.type} at ${formatTime(trip.departureTime)}`)
}

const loadMap = async () => {
  isLoadingMap.value = true
  mapError.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    mapError.value = 'Failed to load map.'
  } finally {
    isLoadingMap.value = false
  }
}

const refreshMap = () => {
  tripCache.clear()
  loadMap()
  fetchData()
}

const toggleFullscreen = () => {
  const mapElement = document.getElementById(mapId)
  if (mapElement) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      mapElement.requestFullscreen()
    }
  }
}

const clearSelection = () => {
  selectedRoute.value = null
}

const centerMap = () => {
  mapCenter.value = [27.709031, 85.313118]
  mapZoom.value = 13
}

onMounted(() => {
  loadMap()
  fetchData()
})
</script>

<style scoped>
.routes-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  padding: 1.5rem;
  border-bottom: 1px solid #333;
}

.header h1 {
  font-size: 2rem;
  color: #00D664;
  margin: 0 0 0.5rem;
}

.header p {
  color: #aaa;
  margin: 0 0 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #00D664;
}

.filter-select {
  padding: 0.5rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  min-width: 150px;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 150px);
}

.map-section {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.map-header {
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.map-header span {
  color: #aaa;
  font-size: 0.9rem;
}

.map-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  background: #333;
  border: 1px solid #555;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: #444;
  border-color: #00D664;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map-container {
  flex: 1;
  position: relative;
}

.map-loading, .map-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  background: #1a1a1a;
}

.map-loading i, .map-error i {
  font-size: 2rem;
  color: #00D664;
  margin-bottom: 1rem;
}

.map-error i {
  color: #e74c3c;
}

.map-error p {
  color: #aaa;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #00D664;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #00b854;
}

.trip-panel {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.trip-details {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.trip-header {
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: #333;
  border: 1px solid #555;
  color: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  width: auto;
}

.close-btn:hover {
  background: #444;
}

.trip-route {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.source { color: #2ecc71; font-weight: bold; }
.destination { color: #e74c3c; font-weight: bold; }
.trip-route i { color: #00D664; }

.route-meta .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.status-badge.active { background: #2ecc71; color: #000; }
.status-badge.scheduled { background: #3498db; color: #000; }
.status-badge.cancelled { background: #e74c3c; color: #000; }

.trips-section {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.trips-section h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.trips-section span {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.trips-list {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #00D664 #2a2a2a;
}

.trips-list::-webkit-scrollbar {
  width: 8px;
}

.trips-list::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.trips-list::-webkit-scrollbar-thumb {
  background: #00D664;
  border-radius: 4px;
}

.no-trips {
  text-align: center;
  padding: 2rem;
  color: #aaa;
}

.no-trips i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.trip-item {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.trip-item:hover {
  border-color: #00D664;
}

.trip-item.past {
  opacity: 0.6;
}

.trip-time {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.time { font-weight: bold; }
.date { font-size: 0.8rem; color: #aaa; }
.duration-line { flex: 1; display: flex; align-items: center; gap: 0.5rem; }
.line { flex: 1; height: 2px; background: linear-gradient(to right, #2ecc71, #e74c3c); }

.trip-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.trip-info i { margin-right: 0.5rem; color: #00D664; }
.vehicle-id { font-size: 0.8rem; color: #aaa; }

.action-btn {
  padding: 0.5rem 1rem;
  background: #00D664;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.action-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: auto;
  }
  .trip-panel {
    max-height: 300px;
  }
  .trips-list {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .header, .main-content { padding: 1rem; }
  .header h1 { font-size: 1.5rem; }
  .controls { flex-direction: column; }
  .map-controls { flex-wrap: wrap; }
  .trip-time { flex-direction: column; align-items: flex-start; }
}
</style>