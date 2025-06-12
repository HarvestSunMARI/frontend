<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Konsultan Tani</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Tambah Konsultan
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Daftar Konsultan -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Daftar Konsultan</h2>
              <div class="flex space-x-2">
                <input
                  type="text"
                  placeholder="Cari konsultan..."
                  class="input-primary"
                />
                <select class="select-primary">
                  <option value="">Semua Spesialisasi</option>
                  <option value="padi">Padi</option>
                  <option value="jagung">Jagung</option>
                  <option value="sayuran">Sayuran</option>
                  <option value="buah">Buah-buahan</option>
                </select>
              </div>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="konsultan in konsultans" 
                 :key="konsultan.id" 
                 class="p-6 hover:bg-gray-50">
              <div class="flex items-start space-x-4">
                <img 
                  :src="konsultan.avatar" 
                  :alt="konsultan.nama"
                  class="w-16 h-16 rounded-full object-cover"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ konsultan.nama }}</h3>
                      <p class="text-sm text-gray-600">{{ konsultan.spesialisasi }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-500">
                        {{ konsultan.pengalaman }} tahun pengalaman
                      </span>
                      <span :class="statusClass(konsultan.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ konsultan.status }}
                      </span>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-600">{{ konsultan.deskripsi }}</p>
                  <div class="mt-4 flex items-center space-x-4">
                    <button class="btn-secondary">
                      <ChatBubbleLeftIcon class="w-5 h-5 mr-2" />
                      Konsultasi
                    </button>
                    <button class="btn-outline">
                      <CalendarIcon class="w-5 h-5 mr-2" />
                      Jadwalkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistik dan Aktivitas -->
      <div class="space-y-6">
        <!-- Statistik -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistik Konsultasi</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-primary-50 rounded-lg">
              <div class="text-2xl font-bold text-primary-600">{{ stats.totalKonsultasi }}</div>
              <div class="text-sm text-gray-600">Total Konsultasi</div>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ stats.konsultasiAktif }}</div>
              <div class="text-sm text-gray-600">Konsultasi Aktif</div>
            </div>
          </div>
        </div>

        <!-- Aktivitas Terbaru -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <div class="space-y-4">
            <div v-for="aktivitas in aktivitasTerbaru" 
                 :key="aktivitas.id" 
                 class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <ChatBubbleLeftIcon class="w-4 h-4 text-primary-600" />
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-900">{{ aktivitas.deskripsi }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ aktivitas.waktu }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  PlusIcon,
  ChatBubbleLeftIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

interface Konsultan {
  id: number
  nama: string
  spesialisasi: string
  pengalaman: number
  status: 'online' | 'offline' | 'busy'
  deskripsi: string
  avatar: string
}

interface Aktivitas {
  id: number
  deskripsi: string
  waktu: string
}

const konsultans = ref<Konsultan[]>([
  {
    id: 1,
    nama: 'Dr. Budi Santoso',
    spesialisasi: 'Spesialis Padi',
    pengalaman: 15,
    status: 'online',
    deskripsi: 'Ahli dalam budidaya padi modern dan pengendalian hama terpadu.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    nama: 'Ir. Siti Aminah',
    spesialisasi: 'Spesialis Sayuran',
    pengalaman: 10,
    status: 'busy',
    deskripsi: 'Pakar dalam pertanian organik dan hidroponik.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    nama: 'Prof. Ahmad Hidayat',
    spesialisasi: 'Spesialis Buah-buahan',
    pengalaman: 20,
    status: 'offline',
    deskripsi: 'Ahli dalam budidaya buah-buahan tropis dan manajemen kebun.',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
])

const stats = ref({
  totalKonsultasi: 156,
  konsultasiAktif: 12
})

const aktivitasTerbaru = ref<Aktivitas[]>([
  {
    id: 1,
    deskripsi: 'Konsultasi dengan Petani A tentang hama wereng',
    waktu: '10 menit yang lalu'
  },
  {
    id: 2,
    deskripsi: 'Jadwal konsultasi baru dengan Kelompok Tani B',
    waktu: '1 jam yang lalu'
  },
  {
    id: 3,
    deskripsi: 'Laporan hasil panen dari Petani C',
    waktu: '2 jam yang lalu'
  }
])

const statusClass = (status: Konsultan['status']) => {
  const classes = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-gray-100 text-gray-800',
    busy: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status]
}
</script>