<template>
  <div id="map" class="map"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { debounce } from 'lodash'

const props = defineProps({
  routes: { type: Array, default: () => [] },
  center: { type: Array, default: () => [27.709031, 85.313118] },
  zoom: { type: Number, default: 13 },
  interactive: { type: Boolean, default: true }
})

const emit = defineEmits(['routeClick'])

const map = ref(null)
const layers = ref([])

onMounted(() => {
  map.value = L.map('map', { zoomControl: props.interactive }).setView(props.center, props.zoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)

  document.addEventListener('fullscreenchange', () => {
    if (map.value) map.value.invalidateSize()
  })

  nextTick(() => updateMap())
})

onUnmounted(() => {
  if (map.value) map.value.remove()
})

const updateMap = debounce(() => {
  if (!map.value) return
  layers.value.forEach(layer => map.value.removeLayer(layer))
  layers.value = []

  const vehicleColors = {
    bus: '#e74c3c',
    tempo: '#5d2409',
    micro: '#04376c',
    default: '#7f8c8d'
  }

  console.log('Rendering routes:', props.routes.map(r => r.properties?.id))
  props.routes.forEach(route => {
    const coords = route.geometry?.coordinates?.map(c => [c[1], c[0]]) || []
    if (coords.length < 2) {
      console.warn('Skipping route with insufficient coordinates:', route.properties?.id)
      return
    }
    const vehicleType = route.properties?.type || 'default'
    const baseColor = vehicleColors[vehicleType] || vehicleColors.default
    // Temporary unique color for debugging overlapping lines
    const uniqueColor = `#${parseInt(route.properties.id.slice(-6), 16).toString(16).padStart(6, '0')}`

    const polyline = L.polyline(coords, { color: uniqueColor, weight: 5 }).addTo(map.value)
    polyline.on('click', () => emit('routeClick', route))
    layers.value.push(polyline)
  })

  if (props.routes.length && layers.value.length) {
    const group = L.featureGroup(layers.value)
    map.value.fitBounds(group.getBounds().pad(0.1))
  }
}, 300)

watch(() => props.routes, () => updateMap(), { deep: true })
</script>

<style scoped>
.map {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1a1a1a;
}
</style>