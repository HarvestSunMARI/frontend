<template>
  <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Buat Tugas Baru</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">{{ error }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</label>
            <input 
              type="text" 
              v-model="formData.title"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
            <select 
              v-model="formData.priority"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konsultan</label>
            <select 
              v-model="formData.assigned_to_id"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Pilih Konsultan</option>
              <option v-for="consultant in consultants" :key="consultant.id" :value="consultant.id">
                {{ consultant.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo</label>
            <input 
              type="date" 
              v-model="formData.due_date"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
          <textarea 
            v-model="formData.description"
            rows="4"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            required
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            :disabled="loading"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import axios from '../plugins/axios'

interface Consultant {
  id: number
  name: string
  email: string
  phone: string
  status: string
}

const props = defineProps<{
  show: boolean,
  initialData?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const loading = ref(false)
const error = ref('')
const consultants = ref<Consultant[]>([])

const formData = reactive({
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  assigned_to_id: '',
  status: 'pending'
})

function toDateInputValue(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

onMounted(async () => {
  try {
    const response = await axios.get('/konsultan')
    consultants.value = response.data.data
    if (props.initialData) {
      Object.assign(formData, props.initialData)
      if (props.initialData.due_date) {
        formData.due_date = toDateInputValue(props.initialData.due_date)
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data konsultan:', err)
    error.value = 'Gagal mengambil data konsultan. Silakan coba lagi.'
  }
})

watch(() => props.initialData, (val) => {
  if (val) {
    Object.assign(formData, val)
    if (val.due_date) {
      formData.due_date = toDateInputValue(val.due_date)
    }
  }
})

const submitForm = async () => {
  loading.value = true
  error.value = ''

  try {
    let response
    if (props.initialData && props.initialData.id) {
      // MODE EDIT
      response = await axios.put(`/tasks/${props.initialData.id}`, formData)
    } else {
      // MODE TAMBAH
      response = await axios.post('/tasks', formData)
    }
    emit('submit', response.data.data)
    emit('close')
    // Reset form jika tambah
    if (!props.initialData) {
      formData.title = ''
      formData.description = ''
      formData.priority = 'medium'
      formData.due_date = ''
      formData.assigned_to_id = ''
      formData.status = 'pending'
    }
  } catch (err: any) {
    console.error('Gagal menyimpan tugas:', err)
    error.value = err.response?.data?.message || 'Gagal menyimpan tugas. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script> 