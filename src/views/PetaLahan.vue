<template>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Peta Lahan</h1>
        <button class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Tambah Lahan
        </button>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Peta -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="h-[600px] bg-gray-100 rounded-lg relative">
              <div id="map" class="w-full h-full"></div>
            </div>
          </div>
        </div>
  
        <!-- Daftar Lahan -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Daftar Lahan</h2>
            <div class="space-y-4">
              <div v-for="field in fields" :key="field.id" class="p-4 border border-gray-200 rounded-lg">
                <h3 class="font-medium text-gray-900">{{ field.name }}</h3>
                <div class="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Luas: {{ field.area }} ha</p>
                  <p>Tanaman: {{ field.crop }}</p>
                  <p>Status: {{ field.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { PlusIcon } from '@heroicons/vue/24/outline'
  import type { FieldData } from '@/types'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  const fields = ref<FieldData[]>([
    { id: 1, name: 'Lahan A', area: 2.5, crop: 'Padi', location: [-6.2088, 106.8456], status: 'active' },
    { id: 2, name: 'Lahan B', area: 3.2, crop: 'Jagung', location: [-6.2188, 106.8556], status: 'active' },
    { id: 3, name: 'Lahan C', area: 1.8, crop: 'Kedelai', location: [-6.2288, 106.8656], status: 'maintenance' }
  ])
  
  onMounted(() => {
    const map = L.map('map').setView([-6.2088, 106.8456], 10)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  
    fields.value.forEach(field => {
      L.marker(field.location)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${field.name}</h3>
            <p>Luas: ${field.area} ha</p>
            <p>Tanaman: ${field.crop}</p>
            <p>Status: ${field.status}</p>
          </div>
        `)
        .addTo(map)
    })
  })
  </script>