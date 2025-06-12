<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Reports</h2>
      <button class="btn-primary" @click="showCreateReport = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Report
      </button>
    </div>

    <!-- Report Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kegiatan</label>
          <select v-model="filters.jenis_kegiatan" class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="">Semua Jenis</option>
            <option value="penyuluhan">Penyuluhan</option>
            <option value="monitoring">Monitoring</option>
            <option value="pelatihan">Pelatihan</option>
            <option value="kunjungan_lapang">Kunjungan Lapang</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <input 
            type="date" 
            v-model="filters.tanggal_dari" 
            class="w-full p-2 border border-gray-300 rounded-lg"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
          <input 
            type="date" 
            v-model="filters.tanggal_sampai" 
            class="w-full p-2 border border-gray-300 rounded-lg"
          >
        </div>
      </div>
    </div>

    <!-- Report Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        label="Total Reports"
        :value="reportStats.total"
        :icon="DocumentTextIcon"
        color="primary"
      />
      <StatCard
        label="This Month"
        :value="reportStats.bulan_ini"
        :icon="CalendarIcon"
        color="blue"
      />
      <StatCard
        label="Active Locations"
        :value="reportStats.lokasi_aktif"
        :icon="TruckIcon"
        color="earth"
      />
      <StatCard
        label="Farmers Involved"
        :value="reportStats.petani_terlibat"
        :icon="HomeIcon"
        color="earth"
      />
    </div>

    <!-- Reports List -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Recent Reports</h3>
        <div class="flex space-x-2">
          <button class="btn-secondary text-sm">Export</button>
          <button class="btn-secondary text-sm">Filter</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in filteredReports" :key="report.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="reportTypeClass(report.jenis_kegiatan)"
                  >
                    <component :is="reportTypeIcon(report.jenis_kegiatan)" class="w-5 h-5" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ report.jenis_kegiatan.replace('_', ' ') }}</div>
                    <div class="text-sm text-gray-500">by {{ report.user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="reportTypeClass(report.jenis_kegiatan)"
                >
                  {{ report.jenis_kegiatan.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ report.lokasi }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="statusClass(report.jenis_kegiatan)"
                >
                  {{ report.jenis_kegiatan.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(report.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="handleViewReport(report)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Lihat
                  </button>
                  <button 
                    @click="handleEditClick(report)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDeleteReport(report.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CreateReportForm :show="showCreateReport" @close="showCreateReport = false" @submit="handleCreateReport" />

    <CreateReportForm 
      v-if="showEditReport && selectedReport"
      :show="showEditReport"
      :initial-data="selectedReport"
      @close="showEditReport = false"
      @submit="handleEditReport"
    />

    <div v-if="showViewReport && selectedReport" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Detail Laporan</h3>
            <button @click="showViewReport = false" class="text-gray-400 hover:text-gray-500">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tanggal</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedReport.tanggal) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Lokasi</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedReport.lokasi }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedReport.jenis_kegiatan.replace('_', ' ') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Jumlah Petani</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedReport.jumlah_petani }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedReport.deskripsi }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Keadaan Lapangan</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedReport.keadaan_lapangan }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Koordinat</label>
            <p class="mt-1 text-sm text-gray-900">
              Lat: {{ selectedReport.koordinat_lat }}, Lng: {{ selectedReport.koordinat_lng }}
            </p>
            <div 
              ref="mapContainer" 
              class="mt-2 h-64 w-full rounded-lg border border-gray-300"
            ></div>
          </div>

          <div v-if="selectedReport.foto && selectedReport.foto.length">
            <label class="block text-sm font-medium text-gray-700">Foto</label>
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div v-for="(foto, index) in selectedReport.foto" :key="index" class="relative group">
                <img :src="getFileUrl(foto)" class="w-full h-32 object-cover rounded-lg cursor-pointer" 
                     @click="window.open(getFileUrl(foto), '_blank')" />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <span class="text-white opacity-0 group-hover:opacity-100">Klik untuk lihat</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedReport.dokumen && selectedReport.dokumen.length">
            <label class="block text-sm font-medium text-gray-700">Dokumen</label>
            <ul class="mt-2 space-y-2">
              <li v-for="(dokumen, index) in selectedReport.dokumen" :key="index">
                <a :href="getFileUrl(dokumen)" 
                   target="_blank" 
                   class="flex items-center text-primary-600 hover:text-primary-900">
                  <DocumentTextIcon class="w-5 h-5 mr-2" />
                  {{ getFileName(dokumen) }}
                </a>
              </li>
            </ul>
          </div>

          <div class="flex justify-end">
            <button 
              @click="showViewReport = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import StatCard from '@/components/StatCard.vue'
import CreateReportForm from '@/components/CreateReportForm.vue'
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  TruckIcon,
  HomeIcon,
  CloudIcon,
  BugAntIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import axios from '../plugins/axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface ReportData {
  id: number
  tanggal: string
  lokasi: string
  jenis_kegiatan: 'harvest' | 'field_condition' | 'weather' | 'pest'
  deskripsi: string
  jumlah_petani: number
  keadaan_lapangan: string
  foto: string[]
  dokumen: string[]
  koordinat_lat: number
  koordinat_lng: number
  user: {
    id: number
    name: string
    email: string
    role: string
  }
  created_at: string
  updated_at: string
}

interface ReportTemplate {
  id: number
  name: string
  type: 'harvest' | 'field_condition' | 'weather' | 'pest'
  description: string
}

const filters = reactive({
  jenis_kegiatan: '',
  tanggal_dari: '',
  tanggal_sampai: ''
})

const reportStats = reactive({
  total: 0,
  bulan_ini: 0,
  lokasi_aktif: 0,
  petani_terlibat: 0
})

const reports = ref<ReportData[]>([])

onMounted(async () => {
  try {
    const res = await axios.get('/reports')
    reports.value = res.data
    // Hitung statistik
    reportStats.total = reports.value.length
    reportStats.bulan_ini = reports.value.filter(r => {
      const reportDate = new Date(r.tanggal)
      const now = new Date()
      return reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear()
    }).length
    reportStats.lokasi_aktif = new Set(reports.value.map(r => r.lokasi)).size
    reportStats.petani_terlibat = reports.value.reduce((sum, r) => sum + r.jumlah_petani, 0)
  } catch (e) {
    console.error('Gagal mengambil data laporan:', e)
    reports.value = []
  }
})

const reportTemplates = ref<ReportTemplate[]>([
  {
    id: 1,
    name: 'Harvest Report',
    type: 'harvest',
    description: 'Standard template for recording harvest data and yields'
  },
  {
    id: 2,
    name: 'Field Inspection',
    type: 'field_condition',
    description: 'Template for routine field condition assessments'
  },
  {
    id: 3,
    name: 'Weather Report',
    type: 'weather',
    description: 'Document weather events and their impact on crops'
  },
  {
    id: 4,
    name: 'Pest Control',
    type: 'pest',
    description: 'Record pest management activities and treatments'
  }
])

const filteredReports = computed(() => {
  let filtered = reports.value

  if (filters.jenis_kegiatan) {
    filtered = filtered.filter(report => report.jenis_kegiatan === filters.jenis_kegiatan)
  }

  if (filters.tanggal_dari) {
    filtered = filtered.filter(report => 
      new Date(report.tanggal) >= new Date(filters.tanggal_dari)
    )
  }

  if (filters.tanggal_sampai) {
    filtered = filtered.filter(report => 
      new Date(report.tanggal) <= new Date(filters.tanggal_sampai)
    )
  }

  return filtered
})

const reportTypeIcon = (type: ReportData['jenis_kegiatan']) => {
  const icons = {
    harvest: TruckIcon,
    field_condition: HomeIcon,
    weather: CloudIcon,
    pest: BugAntIcon
  }
  return icons[type]
}

const reportTypeClass = (type: ReportData['jenis_kegiatan']) => {
  const classes = {
    harvest: 'bg-green-100 text-green-600',
    field_condition: 'bg-earth-100 text-earth-600',
    weather: 'bg-blue-100 text-blue-600',
    pest: 'bg-red-100 text-red-600'
  }
  return classes[type]
}

const statusClass = (status: ReportData['jenis_kegiatan']) => {
  const classes = {
    harvest: 'bg-green-100 text-green-800',
    field_condition: 'bg-earth-100 text-earth-800',
    weather: 'bg-blue-100 text-blue-800',
    pest: 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const useTemplate = (template: ReportTemplate) => {
  console.log('Using template:', template.name)
  // Add logic to open report creation form with template
}

const showCreateReport = ref(false)
const showEditReport = ref(false)
const showViewReport = ref(false)
const selectedReport = ref<ReportData | null>(null)

const handleViewReport = (report: ReportData) => {
  selectedReport.value = report
  showViewReport.value = true
}

const handleEditClick = (report: ReportData) => {
  selectedReport.value = report
  showEditReport.value = true
}

const handleEditReport = async (data: any) => {
  try {
    const formData = new FormData()
    formData.append('tanggal', data.tanggal)
    formData.append('lokasi', data.lokasi)
    formData.append('jenis_kegiatan', data.jenisKegiatan)
    formData.append('deskripsi', data.deskripsi)
    formData.append('jumlah_petani', data.jumlahPetani)
    formData.append('keadaan_lapangan', data.keadaanLapangan)
    formData.append('koordinat_lat', data.koordinat.lat)
    formData.append('koordinat_lng', data.koordinat.lng)
    if (data.foto && data.foto.length) {
      data.foto.forEach((f: File) => formData.append('foto[]', f))
    }
    if (data.dokumen && data.dokumen.length) {
      data.dokumen.forEach((d: File) => formData.append('dokumen[]', d))
    }

    await axios.put(`/reports/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    showEditReport.value = false
    // Refresh data
    const res = await axios.get('/reports')
    reports.value = res.data
  } catch (e) {
    alert('Gagal mengedit laporan!')
  }
}

const handleDeleteReport = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
    try {
      await axios.delete(`/reports/${id}`)
      // Refresh data setelah delete
      const res = await axios.get('/reports')
      reports.value = res.data
    } catch (e) {
      alert('Gagal menghapus laporan!')
    }
  }
}

async function handleCreateReport(data: any) {
  const formData = new FormData()
  formData.append('tanggal', data.tanggal)
  formData.append('lokasi', data.lokasi)
  formData.append('jenis_kegiatan', data.jenisKegiatan)
  formData.append('deskripsi', data.deskripsi)
  formData.append('jumlah_petani', data.jumlahPetani)
  formData.append('keadaan_lapangan', data.keadaanLapangan)
  formData.append('koordinat_lat', data.koordinat.lat)
  formData.append('koordinat_lng', data.koordinat.lng)
  if (data.foto && data.foto.length) {
    data.foto.forEach((f: File) => formData.append('foto[]', f))
  }
  if (data.dokumen && data.dokumen.length) {
    data.dokumen.forEach((d: File) => formData.append('dokumen[]', d))
  }
  try {
    await axios.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    showCreateReport.value = false
    // Refresh data
    const res = await axios.get('/reports')
    reports.value = res.data
  } catch (e) {
    alert('Gagal mengirim laporan!')
  }
}

const recentReports = computed(() => {
  return [...reports.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)
})

const getFileUrl = (path: string) => {
  if (!path) return ''
  // Jika path sudah berupa URL lengkap, gunakan langsung
  if (path.startsWith('http')) return path
  // Jika tidak, tambahkan base URL storage
  return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${path}`
}

const getFileName = (path: string) => {
  if (!path) return ''
  return path.split('/').pop() || ''
}

// Tambahkan setelah interface ReportData
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

// Tambahkan fungsi untuk inisialisasi peta
const initMap = (lat: number, lng: number) => {
  if (!mapContainer.value) return

  // Hapus peta lama jika ada
  if (map) {
    map.remove()
  }

  // Buat peta baru
  map = L.map(mapContainer.value).setView([lat, lng], 15)
  
  // Tambahkan tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Tambahkan marker
  marker = L.marker([lat, lng]).addTo(map)
}

// Tambahkan watcher untuk koordinat
watch(() => selectedReport.value, (newReport) => {
  if (newReport && newReport.koordinat_lat && newReport.koordinat_lng) {
    // Tunggu DOM update
    nextTick(() => {
      initMap(newReport.koordinat_lat, newReport.koordinat_lng)
    })
  }
})

// Cleanup saat komponen dihancurkan
onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>