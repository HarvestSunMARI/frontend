<template>
  <div>
    <div id="coordinate-map" class="w-full h-64 rounded border"></div>
    <div v-if="lat !== null && lng !== null" class="mt-2 text-sm text-gray-700">
      Koordinat terpilih: <b>{{ lat }}, {{ lng }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['picked'])
const lat = ref<number|null>(null)
const lng = ref<number|null>(null)

onMounted(() => {
  const map = L.map('coordinate-map').setView([-6.2088, 106.8456], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  let marker: L.Marker | null = null

  map.on('click', function(e: any) {
    lat.value = e.latlng.lat
    lng.value = e.latlng.lng
    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map)
    }
    emit('picked', { lat: lat.value, lng: lng.value })
  })
})
</script>

<style scoped>
#coordinate-map {
  min-height: 250px;
}
</style> 