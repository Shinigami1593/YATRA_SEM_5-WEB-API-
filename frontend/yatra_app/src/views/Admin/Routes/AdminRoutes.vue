<template>
  <div class="admin-routes">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <button @click="openAddDialog" class="btn-primary">
            <PlusIcon class="icon-sm" />
            Add Route
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active">
              <MapPinIcon class="icon-md" />
            </div>
            <div class="stat-info">
              <p class="stat-number">{{ activeRoutesCount }}</p>
              <p class="stat-label">Active Routes</p>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-icon passengers">
              <UsersIcon class="icon-md" />
            </div>
            <div class="stat-info">
              <p class="stat-number">0</p>
              <p class="stat-label">Passengers</p>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-icon delayed">
              <ClockIcon class="icon-md" />
            </div>
            <div class="stat-info">
              <p class="stat-number">0</p>
              <p class="stat-label">Delayed</p>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <BusIcon class="icon-md" />
            </div>
            <div class="stat-info">
              <p class="stat-number">{{ routes.length }}</p>
              <p class="stat-label">Total Routes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section">
        <div class="filters-content">
          <div class="search-container">
            <div class="search-input-wrapper">
              <SearchIcon class="search-icon" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search routes..."
                class="search-input"
              />
            </div>
          </div>
          <select v-model="filterType" class="filter-select">
            <option value="all">All Types</option>
            <option value="bus">Bus</option>
            <option value="micro">Micro</option>
            <option value="tempo">Tempo</option>
          </select>
          <select v-model="filterStatus" class="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Routes List -->
      <div class="routes-list">
        <div
          v-for="route in filteredRoutes"
          :key="route.properties.id"
          class="route-card"
        >
          <div class="route-content">
            <!-- Route Info -->
            <div class="route-info">
              <div class="route-header">
                <div class="route-title-section">
                  <h3 class="route-name">{{ route.properties.name }}</h3>
                  <p class="route-id">ID: {{ route.properties.id }}</p>
                </div>
                <div class="route-badges">
                  <span :class="getTypeBadgeClass(route.properties.type)" class="badge type-badge">
                    <component :is="getTypeIcon(route.properties.type)" class="icon-xs" />
                    <span class="badge-text">{{ route.properties.type || 'N/A' }}</span>
                  </span>
                  <span :class="getStatusBadgeClass(route.properties.status)" class="badge status-badge">
                    {{ route.properties.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>

              <!-- Route Path -->
              <div class="route-path">
                <div class="path-point source">
                  <div class="point-indicator source-point"></div>
                  <div class="point-info">
                    <p class="point-label">From</p>
                    <p class="point-location">{{ route.properties.source }}</p>
                  </div>
                </div>
                <div class="path-connector">
                  <div class="connector-line"></div>
                  <MapPinIcon class="connector-icon" />
                  <div class="connector-line"></div>
                </div>
                <div class="path-point destination">
                  <div class="point-info">
                    <p class="point-label">To</p>
                    <p class="point-location">{{ route.properties.destination }}</p>
                  </div>
                  <div class="point-indicator destination-point"></div>
                </div>
              </div>

              <!-- Coordinates Info -->
              <div class="coordinates-info">
                <div class="coordinate-item">
                  <p class="coordinate-label">Source Coordinates</p>
                  <p class="coordinate-value">
                    {{ route.geometry.coordinates[0][1].toFixed(4) }}, {{ route.geometry.coordinates[0][0].toFixed(4) }}
                  </p>
                </div>
                <div class="coordinate-item">
                  <p class="coordinate-label">Destination Coordinates</p>
                  <p class="coordinate-value">
                    {{ route.geometry.coordinates[1][1].toFixed(4) }}, {{ route.geometry.coordinates[1][0].toFixed(4) }}
                  </p>
                </div>
              </div>

              <!-- Route Metadata -->
              <div class="route-metadata">
                <div class="metadata-item">
                  <p class="metadata-label">Created</p>
                  <p class="metadata-value">{{ formatDate(route.properties.createdAt || '2025-07-21T00:00:00Z') }}</p>
                </div>
                <div class="metadata-item">
                  <p class="metadata-label">Updated</p>
                  <p class="metadata-value">{{ formatDate(route.properties.updatedAt || '2025-07-21T00:00:00Z') }}</p>
                </div>
                <div class="metadata-item">
                  <p class="metadata-label">User ID</p>
                  <p class="metadata-value user-id">{{ route.properties.user || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="route-actions">
              <button @click="editRoute(route)" class="btn-action edit">
                <EditIcon class="icon-sm" />
                Edit
              </button>
              <button @click="confirmDelete(route)" class="btn-action delete">
                <Trash2Icon class="icon-sm" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRoutes.length === 0" class="empty-state">
        <MapPinIcon class="empty-icon" />
        <h3 class="empty-title">No routes found</h3>
        <p class="empty-description">Try adjusting your search or filters, or add a new route.</p>
        <button @click="openAddDialog" class="btn-primary">
          <PlusIcon class="icon-sm" />
          Add Your First Route
        </button>
      </div>
    </div>

    <!-- Add/Edit Route Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ editingRoute ? 'Edit Route' : 'Add New Route' }}
          </h2>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Route Name *</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter route name"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Vehicle Type</label>
              <select v-model="formData.type" class="form-select">
                <option value="">Select type</option>
                <option value="bus">Bus</option>
                <option value="micro">Micro</option>
                <option value="tempo">Tempo</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Source Location *</label>
              <input
                v-model="formData.source"
                type="text"
                placeholder="Enter source location"
                class="form-input"
                @input="debouncedGeocodeLocation('source')"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Destination *</label>
              <input
                v-model="formData.destination"
                type="text"
                placeholder="Enter destination"
                class="form-input"
                @input="debouncedGeocodeLocation('destination')"
                required
              />
            </div>
          </div>

          <div class="coordinates-section">
            <label class="section-label">Source Coordinates *</label>
            <div class="coordinate-grid">
              <div class="coordinate-group">
                <label class="coordinate-label">Longitude</label>
                <input
                  v-model.number="formData.coordinates.source.lon"
                  type="number"
                  step="any"
                  placeholder="85.3240"
                  class="coordinate-input"
                  required
                  disabled
                />
              </div>
              <div class="coordinate-group">
                <label class="coordinate-label">Latitude</label>
                <input
                  v-model.number="formData.coordinates.source.lat"
                  type="number"
                  step="any"
                  placeholder="27.7172"
                  class="coordinate-input"
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <div class="coordinates-section">
            <label class="section-label">Destination Coordinates *</label>
            <div class="coordinate-grid">
              <div class="coordinate-group">
                <label class="coordinate-label">Longitude</label>
                <input
                  v-model.number="formData.coordinates.destination.lon"
                  type="number"
                  step="any"
                  placeholder="85.3000"
                  class="coordinate-input"
                  required
                  disabled
                />
              </div>
              <div class="coordinate-group">
                <label class="coordinate-label">Latitude</label>
                <input
                  v-model.number="formData.coordinates.destination.lat"
                  type="number"
                  step="any"
                  placeholder="27.7300"
                  class="coordinate-input"
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="isActiveStatus"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-text">Active Route</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editingRoute ? 'Update Route' : 'Add Route' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-container delete-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Delete Route</h2>
        </div>
        <div class="modal-body">
          <p class="delete-message">
            Are you sure you want to delete "{{ routeToDelete?.properties.name }}"? This action cannot be undone.
          </p>
          <div class="form-actions">
            <button @click="closeDeleteModal" class="btn-secondary">
              Cancel
            </button>
            <button @click="deleteRoute" class="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  Trash2Icon,
  MapPinIcon,
  BusIcon,
  CarIcon,
  TruckIcon,
  ClockIcon,
  UsersIcon
} from 'lucide-vue-next'
import { adminApiClient, userApiClient } from '@/services/axios'
import { useAuthStore } from '@/stores/Auth'
import { constant } from 'lodash'

// Custom debounce function
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Reactive data
const routes = ref([])
const searchTerm = ref('')
const filterType = ref('all')
const filterStatus = ref('all')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingRoute = ref(null)
const routeToDelete = ref(null)

// Access auth store for user ID
const authStore = useAuthStore()

// Form data matching Mongoose schema
const formData = ref({
  name: '',
  source: '',
  destination: '',
  type: '',
  status: 'active',
  coordinates: {
    source: { lat: null, lon: null },
    destination: { lat: null, lon: null }
  }
});


// Geocoding state
const isGeocoding = ref(false)

// Computed properties
const activeRoutesCount = computed(() => routes.value.filter(route => route.properties.status === 'active').length)
const isActiveStatus = computed({
  get: () => formData.value.status === 'active',
  set: (value) => { formData.value.status = value ? 'active' : 'inactive' }
})
const filteredRoutes = computed(() => {
  return routes.value.filter(route => {
    const matchesSearch = route.properties.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         route.properties.source.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         route.properties.destination.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = filterType.value === 'all' || route.properties.type === filterType.value
    const matchesStatus = filterStatus.value === 'all' || route.properties.status === filterStatus.value
    return matchesSearch && matchesType && matchesStatus
  })
})

// Methods
const getTypeIcon = (type) => (type === 'bus' ? BusIcon : type === 'micro' ? CarIcon : type === 'tempo' ? TruckIcon : BusIcon)
const getTypeBadgeClass = (type) => (type === 'bus' ? 'badge-bus' : type === 'micro' ? 'badge-micro' : type === 'tempo' ? 'badge-tempo' : 'badge-default')
const getStatusBadgeClass = (status) => (status === 'active' ? 'badge-active' : 'badge-inactive')
const formatDate = (dateString) => new Date(dateString).toLocaleString()

const resetForm = () => {
  formData.value = {
    name: '',
    source: '',
    destination: '',
    coordinates: {
      source: { lat: null, lon: null },
      destination: { lat: null, lon: null }
    },
    type: '',
    status: 'active',
    // user: authStore.getUser?._id || ''
  }
}

const openAddDialog = () => {
  editingRoute.value = null
  resetForm()
  showModal.value = true
  nextTick(() => {
    if (formData.value.source) geocodeLocation('source')
    if (formData.value.destination) geocodeLocation('destination')
  })
}

const editRoute = (route) => {
  editingRoute.value = route
  formData.value = {
    name: route.properties.name,
    source: route.properties.source,
    destination: route.properties.destination,
    coordinates: {
      source: { type: 'Point', coordinates: route.geometry.coordinates[0] },
      destination: { type: 'Point', coordinates: route.geometry.coordinates[1] }
    },
    type: route.properties.type || '',
    status: route.properties.status,
    // user: route.properties.user || authStore.getUser?._id || ''
  }
  showModal.value = true
  nextTick(() => {
    geocodeLocation('source')
    geocodeLocation('destination')
  })
}

const closeModal = () => {
  showModal.value = false
  editingRoute.value = null
  resetForm()
}

const confirmDelete = (route) => {
  routeToDelete.value = route
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  routeToDelete.value = null
}

const geocodeLocation = async (type) => {
  if (isGeocoding.value) return
  isGeocoding.value = true

  try {
    const location = type === 'source' ? formData.value.source : formData.value.destination
    if (!location || location.trim() === '') {
      if (type === 'source') formData.value.coordinates.source.coordinates = [0, 0]
      else formData.value.coordinates.destination.coordinates = [0, 0]
      return
    }

    const apiKey = '536b1aa1ad27498994308171ca7d0a55'
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(location)}&boundary.country=NP`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.features && data.features.length > 0) {
      const { geometry } = data.features[0]
      const [lon, lat] = geometry.coordinates
      if (type === 'source') formData.value.coordinates.source.coordinates = [lon, lat]
      else formData.value.coordinates.destination.coordinates = [lon, lat]
    } else {
      if (type === 'source') formData.value.coordinates.source.coordinates = [0, 0]
      else formData.value.coordinates.destination.coordinates = [0, 0]
    }
  } catch (error) {
    console.error(`Geocoding error for ${type}:`, error)
    if (type === 'source') formData.value.coordinates.source.coordinates = [0, 0]
    else formData.value.coordinates.destination.coordinates = [0, 0]
  } finally {
    isGeocoding.value = false
  }
}

const debouncedGeocodeLocation = debounce(geocodeLocation, 500)

const handleSubmit = async () => {
  try {
    console.log('Form raw data:', JSON.stringify(formData.value, null, 2));

    const { name, source, destination, coordinates, type, status } = formData.value;

    if (!name || !source || !destination || !coordinates?.source?.coordinates || !coordinates?.destination?.coordinates) {
      throw new Error('Missing required fields or coordinates.');
    }

    // coordinates.source.coordinates = [lon, lat]
    const [srcLon, srcLat] = coordinates.source.coordinates;
    const [destLon, destLat] = coordinates.destination.coordinates;

    if (
      typeof srcLat !== 'number' || isNaN(srcLat) ||
      typeof srcLon !== 'number' || isNaN(srcLon) ||
      typeof destLat !== 'number' || isNaN(destLat) ||
      typeof destLon !== 'number' || isNaN(destLon) ||
      srcLat === 0 && srcLon === 0 ||
      destLat === 0 && destLon === 0
    ) {
      throw new Error('Invalid coordinates. Please select valid source and destination.');
    }

    const routeData = {
      name: name.trim(),
      source: source.trim(),
      destination: destination.trim(),
      coordinates: {
        source: { lat: srcLat, lon: srcLon },
        destination: { lat: destLat, lon: destLon }
      },
      type: type.trim(),
      status: status || 'active',
    };

    console.log('Sending routeData:', routeData);

    if (editingRoute.value) {
      const routeId = editingRoute.value.properties?.id || editingRoute.value._id;
      console.log(routeId)
      const response = await adminApiClient.put(`/routes/${routeId}`, routeData);
      const index = routes.value.findIndex(r =>
        r._id === routeId || r.properties?.id === routeId
      );
      if (index !== -1) routes.value[index] = response.data;
      showToast('Success', 'Route updated successfully');
    } else {
      const response = await adminApiClient.post('/routes/create', routeData);
      routes.value.push(response.data);
      showToast('Success', 'Route added successfully');
    }

    closeModal();
  } catch (error) {
    console.error('Error saving route:', error);
    showToast('Error', error.response?.data?.message || error.message || 'Failed to save route');
  }
};






const deleteRoute = async () => {
  const selectedRoute = routeToDelete.value;

  if (!selectedRoute || !selectedRoute.properties || !selectedRoute.properties.id) {
    console.error('Route ID is missing');
    showToast('Error', 'Route ID is missing');
    return;
  }

  const routeId = selectedRoute.properties.id;

  try {
    await adminApiClient.delete(`/routes/${routeId}`);
    routes.value = routes.value.filter(route => route.properties.id !== routeId);
    showToast('Success', 'Route deleted successfully');
  } catch (error) {
    console.error('Error deleting route:', error);
    showToast('Error', error.response?.data?.message || 'Failed to delete route');
  } finally {
    closeDeleteModal();
  }
};



const showToast = (title, message) => {
  console.log(`${title}: ${message}`)
  if (typeof window !== 'undefined') alert(`${title}: ${message}`)
}

const fetchRoutes = async () => {
  try {
    const response = await userApiClient.get('/routes')
    routes.value = response.data.routes || []
  } catch (error) {
    console.error('Error fetching routes:', error)
    showToast('Error', 'Failed to load routes')
  }
}

onMounted(() => fetchRoutes())
</script>

<style scoped>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-routes {
  min-height: 100vh;
  background-color: #0f0f0f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Icons */
.icon-xs {
  width: 12px;
  height: 12px;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.empty-icon {
  width: 64px;
  height: 64px;
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #333333;
}

.header-content {
  display: flex;
  justify-content: end;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 2rem;
  font-weight: 700;
  color: #00D664;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #a0a0a0;
  font-size: 1rem;
}

/* Buttons */
.btn-primary {
  background-color: #00D664;
  color: #000000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-primary:hover {
  background-color: #26A653;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: #a0a0a0;
  border: 2px solid #333333;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background-color: #333333;
  color: #ffffff;
}

.btn-danger {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #00D664;
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.active {
  background-color: rgba(0, 214, 100, 0.2);
  color: #00D664;
}

.stat-icon.passengers {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.stat-icon.delayed {
  background-color: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.stat-icon.total {
  background-color: rgba(0, 214, 100, 0.2);
  color: #00D664;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* Filters Section */
.filters-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-container {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0a0a0;
  width: 16px;
  height: 16px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: #333333;
  border: 2px solid #444444;
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

.search-input::placeholder {
  color: #a0a0a0;
}

.filter-select {
  padding: 0.75rem 1rem;
  background-color: #333333;
  border: 2px solid #444444;
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

/* Routes List */
.routes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.route-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #333333;
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.route-card:hover {
  border-color: rgba(0, 214, 100, 0.5);
  transform: translateY(-2px);
}

.route-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.route-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Route Header */
.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.route-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.route-id {
  color: #00D664;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.route-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid;
  text-transform: capitalize;
}

.badge-bus {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border-color: rgba(52, 152, 219, 0.3);
}

.badge-micro {
  background-color: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border-color: rgba(243, 156, 18, 0.3);
}

.badge-tempo {
  background-color: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
  border-color: rgba(155, 89, 182, 0.3);
}

.badge-default {
  background-color: rgba(102, 102, 102, 0.2);
  color: #666666;
  border-color: rgba(102, 102, 102, 0.3);
}

.badge-active {
  background-color: rgba(0, 214, 100, 0.2);
  color: #00D664;
  border-color: rgba(0, 214, 100, 0.3);
}

.badge-inactive {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.3);
}

/* Route Path */
.route-path {
  background-color: #333333;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.path-point {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.path-point.destination {
  flex-direction: row-reverse;
}

.point-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.source-point {
  background-color: #00D664;
}

.destination-point {
  background-color: #e74c3c;
}

.point-label {
  color: #a0a0a0;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.point-location {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.path-connector {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.connector-line {
  height: 2px;
  background-color: #555555;
  flex: 1;
}

.connector-icon {
  color: #00D664;
  width: 16px;
  height: 16px;
}

/* Coordinates Info */
.coordinates-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background-color: rgba(42, 42, 42, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
}

.coordinate-item {
  text-align: center;
}

.coordinate-label {
  color: #a0a0a0;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.coordinate-value {
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

/* Route Metadata */
.route-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  font-size: 0.9rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metadata-label {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.metadata-value {
  color: #ffffff;
}

.user-id {
  font-family: 'Courier New', monospace;
}

/* Route Actions */
.route-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 120px;
}

.btn-action {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  border: 2px solid;
}

.btn-action.edit {
  background-color: transparent;
  color: #00D664;
  border-color: #00D664;
}

.btn-action.edit:hover {
  background-color: #00D664;
  color: #000000;
}

.btn-action.delete {
  background-color: transparent;
  color: #e74c3c;
  border-color: #e74c3c;
}

.btn-action.delete:hover {
  background-color: #e74c3c;
  color: #ffffff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  color: #555555;
  margin: 0 auto 1rem;
}

.empty-title {
  font-size: 1.25rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #a0a0a0;
  margin-bottom: 2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background-color: #1a1a1a;
  border: 2px solid #333333;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.delete-modal {
  max-width: 500px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 2px solid #333333;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.modal-body {
  padding: 2rem;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #a0a0a0;
  font-weight: 600;
  font-size: 0.9rem;
}

.section-label {
  color: #a0a0a0;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  background-color: #333333;
  border: 2px solid #444444;
  border-radius: 6px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

.form-input::placeholder {
  color: #a0a0a0;
}

/* Coordinates Section */
.coordinates-section {
  margin-bottom: 1.5rem;
}

.coordinate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinate-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coordinate-label {
  color: #666666;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.coordinate-input {
  padding: 0.75rem 1rem;
  background-color: #333333;
  border: 2px solid #444444;
  border-radius: 6px;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.coordinate-input:focus {
  outline: none;
  border-color: #00D664;
  box-shadow: 0 0 0 3px rgba(0, 214, 100, 0.1);
}

/* Checkbox */
.checkbox-group {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #a0a0a0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #00D664;
}

.checkbox-text {
  font-weight: 500;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #333333;
}

/* Delete Modal */
.delete-message {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-content {
    flex-direction: column;
  }

  .search-container {
    min-width: auto;
  }

  .route-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .route-actions {
    flex-direction: row;
    min-width: auto;
  }

  .route-header {
    flex-direction: column;
    align-items: stretch;
  }

  .path-point {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .path-connector {
    flex-direction: column;
    gap: 0.25rem;
  }

  .connector-line {
    width: 2px;
    height: 20px;
  }

  .coordinates-info {
    grid-template-columns: 1fr;
  }

  .route-metadata {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .coordinate-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }

  .route-name {
    font-size: 1.1rem;
  }

  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

/* Transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #444444;
}
</style>