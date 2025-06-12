<template>
  <DashboardCard :title="title" :icon="MapIcon">
    <div class="h-64 bg-gray-100 rounded-lg relative">
      <div id="map" class="w-full h-full"></div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardCard from './DashboardCard.vue'
import { MapIcon } from '@heroicons/vue/24/outline'
import type { FieldData } from '@/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  fields: FieldData[]
  title?: string
}>()

onMounted(() => {
  const map = L.map('map').setView([-6.2088, 106.8456], 10)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  props.fields.forEach(field => {
    L.marker(field.location)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${field.name}</h3>
          <p>Area: ${field.area} ha</p>
          <p>Crop: ${field.crop}</p>
          <p>Status: ${field.status}</p>
        </div>
      `)
      .addTo(map)
  })
})
</script>