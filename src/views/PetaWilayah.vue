<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Peta Wilayah</h1>
      <div class="flex space-x-4">
        <button class="btn-secondary">
          <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
          Export Data
        </button>
        <button class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Tambah Wilayah
        </button>
      </div>
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

      <!-- Statistik Wilayah -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistik Wilayah</h2>
          <div class="space-y-4">
            <div class="p-4 bg-primary-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total Area</p>
                  <p class="text-2xl font-bold text-gray-900">1,250 ha</p>
                </div>
                <HomeIcon class="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Lahan Aktif</p>
                  <p class="text-2xl font-bold text-gray-900">890 ha</p>
                </div>
                <ChartBarIcon class="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Jumlah Petani</p>
                  <p class="text-2xl font-bold text-gray-900">156</p>
                </div>
                <UsersIcon class="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar Wilayah -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Daftar Wilayah</h2>
          <div class="space-y-4">
            <div v-for="region in regions" :key="region.id" class="p-4 border border-gray-200 rounded-lg">
              <h3 class="font-medium text-gray-900">{{ region.name }}</h3>
              <div class="mt-2 space-y-1 text-sm text-gray-600">
                <p>Luas: {{ region.area }} ha</p>
                <p>Jumlah Lahan: {{ region.fieldCount }}</p>
                <p>Status: {{ region.status }}</p>
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
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  HomeIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Region {
  id: number
  name: string
  area: number
  fieldCount: number
  status: 'active' | 'inactive'
  location: [number, number]
}

const regions = ref<Region[]>([
  { 
    id: 1, 
    name: 'Wilayah A', 
    area: 450, 
    fieldCount: 25, 
    status: 'active',
    location: [-6.2088, 106.8456]
  },
  { 
    id: 2, 
    name: 'Wilayah B', 
    area: 380, 
    fieldCount: 18, 
    status: 'active',
    location: [-6.2188, 106.8556]
  },
  { 
    id: 3, 
    name: 'Wilayah C', 
    area: 420, 
    fieldCount: 22, 
    status: 'active',
    location: [-6.2288, 106.8656]
  }
])

onMounted(() => {
  const map = L.map('map').setView([-6.2088, 106.8456], 10)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  regions.value.forEach(region => {
    L.marker(region.location)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${region.name}</h3>
          <p>Luas: ${region.area} ha</p>
          <p>Jumlah Lahan: ${region.fieldCount}</p>
          <p>Status: ${region.status}</p>
        </div>
      `)
      .addTo(map)
  })
})
</script>