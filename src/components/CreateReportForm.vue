<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" @click="$emit('close')">&times;</button>
      <h2 class="text-xl font-bold mb-4">Buat Laporan Baru</h2>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Tanggal</label>
          <input type="date" v-model="form.tanggal" class="input-primary w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Lokasi</label>
          <input type="text" v-model="form.lokasi" class="input-primary w-full" placeholder="Masukkan lokasi" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Jenis Kegiatan</label>
          <select v-model="form.jenisKegiatan" class="input-primary w-full" required>
            <option value="">Pilih Jenis Kegiatan</option>
            <option v-for="jenis in jenisKegiatanList" :key="jenis" :value="jenis">{{ jenis }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Jumlah Petani</label>
          <input type="number" v-model="form.jumlahPetani" class="input-primary w-full" min="1" required />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Deskripsi Kegiatan</label>
          <textarea v-model="form.deskripsi" class="input-primary w-full" rows="2" required></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Keadaan Lapangan</label>
          <select v-model="form.keadaanLapangan" class="input-primary w-full" required>
            <option value="">Pilih Keadaan</option>
            <option v-for="keadaan in keadaanLapanganList" :key="keadaan" :value="keadaan">{{ keadaan }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Foto Dokumentasi</label>
          <input type="file" multiple @change="handleFileUpload" class="input-primary w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Dokumen Pendukung</label>
          <input type="file" multiple @change="handleDokumenUpload" class="input-primary w-full" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Koordinat Lokasi</label>
          <CoordinatePicker @picked="val => form.koordinat = val" />
        </div>
        <div class="md:col-span-2 flex justify-end space-x-2 mt-2">
          <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
          <button type="submit" class="btn-primary">Kirim</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import CoordinatePicker from './CoordinatePicker.vue'

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

const props = defineProps<{
  show: boolean
  initialData?: ReportData
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const lokasiList = [
  'Desa A', 'Desa B', 'Desa C', 'Lahan 1', 'Lahan 2'
]
const jenisKegiatanList = [
  'Penyuluhan', 'Monitoring', 'Pelatihan', 'Kunjungan Lapang'
]
const keadaanLapanganList = [
  'Baik', 'Cukup', 'Kurang'
]

const form = ref({
  tanggal: props.initialData?.tanggal || '',
  lokasi: props.initialData?.lokasi || '',
  jenisKegiatan: props.initialData?.jenis_kegiatan || '',
  deskripsi: props.initialData?.deskripsi || '',
  jumlahPetani: props.initialData?.jumlah_petani || 1,
  keadaanLapangan: props.initialData?.keadaan_lapangan || '',
  koordinat: {
    lat: props.initialData?.koordinat_lat || 0,
    lng: props.initialData?.koordinat_lng || 0
  },
  foto: [] as File[],
  dokumen: [] as File[]
})

// Reset form ketika modal dibuka/ditutup
watch(() => props.show, (newVal) => {
  if (newVal && props.initialData) {
    form.value = {
      tanggal: props.initialData.tanggal,
      lokasi: props.initialData.lokasi,
      jenisKegiatan: props.initialData.jenis_kegiatan,
      deskripsi: props.initialData.deskripsi,
      jumlahPetani: props.initialData.jumlah_petani,
      keadaanLapangan: props.initialData.keadaan_lapangan,
      koordinat: {
        lat: props.initialData.koordinat_lat,
        lng: props.initialData.koordinat_lng
      },
      foto: [],
      dokumen: []
    }
  }
})

function handleFileUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    form.value.foto = Array.from(files)
  }
}

function handleDokumenUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    form.value.dokumen = Array.from(files)
  }
}

function submitForm() {
  emit('submit', {
    ...form.value,
    id: props.initialData?.id
  })
}
</script>

<style scoped>
.input-primary {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full;
}
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150 px-4 py-2 rounded;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-150 px-4 py-2 rounded;
}
</style> 