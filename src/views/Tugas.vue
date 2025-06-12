<template>
  <div class="space-y-6">
    <template v-if="user?.role === 'penyuluh'">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Tugas Konsultan</h2>
        <button class="btn-primary" @click="showCreateTask = true">
          <PlusIcon class="w-4 h-4 mr-2" />
          Buat Tugas Baru
        </button>
      </div>

      <!-- Task Filters -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">Dalam Pengerjaan</option>
              <option value="completed">Selesai</option>
              <option value="overdue">Terlambat</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
            <select v-model="filters.priority" class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Semua Prioritas</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konsultan</label>
            <select v-model="filters.assigned_to" class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Semua Konsultan</option>
              <option v-for="consultant in consultants" :key="consultant.id" :value="consultant.id">
                {{ consultant.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
            <input 
              type="date" 
              v-model="filters.due_date" 
              class="w-full p-2 border border-gray-300 rounded-lg"
            >
          </div>
        </div>
      </div>

      <!-- Task Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Tugas"
          :value="taskStats.total"
          :icon="ClipboardDocumentListIcon"
          color="primary"
        />
        <StatCard
          label="Dalam Pengerjaan"
          :value="taskStats.in_progress"
          :icon="ClockIcon"
          color="yellow"
        />
        <StatCard
          label="Selesai"
          :value="taskStats.completed"
          :icon="CheckCircleIcon"
          color="green"
        />
        <StatCard
          label="Terlambat"
          :value="taskStats.overdue"
          :icon="ExclamationCircleIcon"
          color="red"
        />
      </div>

      <!-- Tasks List -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Tugas</h3>
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
                  Tugas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioritas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konsultan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in filteredTasks" :key="task.id">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <ClipboardDocumentListIcon class="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                      <div class="text-sm text-gray-500">{{ task.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="priorityClass(task.priority)"
                  >
                    {{ priorityLabel(task.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ task.assigned_to ? task.assigned_to.name : '-' }}</div>
                  <div class="text-sm text-gray-500">{{ task.assigned_to ? task.assigned_to.email : '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="statusClass(task.status)"
                  >
                    {{ statusLabel(task.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(task.due_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="handleViewTask(task)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Lihat
                    </button>
                    <button 
                      @click="handleEditTask(task)"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button 
                      @click="handleDeleteTask(task.id)"
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

      <!-- Create Task Form -->
      <CreateTaskForm 
        :show="showCreateTask" 
        @close="showCreateTask = false" 
        @submit="handleCreateTask" 
      />

      <!-- Edit Task Form -->
      <CreateTaskForm
        v-if="showEditTask && editTaskData"
        :show="showEditTask"
        :initial-data="editTaskData"
        @close="showEditTask = false"
        @submit="handleUpdateTask"
      />

      <!-- View Task Modal -->
      <div v-if="showViewTask && selectedTask" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Detail Tugas</h3>
              <button @click="showViewTask = false" class="text-gray-400 hover:text-gray-500">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Judul</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTask.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Prioritas</label>
                <p class="mt-1">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="priorityClass(selectedTask.priority)"
                  >
                    {{ priorityLabel(selectedTask.priority) }}
                  </span>
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Konsultan</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTask.assigned_to ? selectedTask.assigned_to.name : '-' }}</p>
                <p class="text-sm text-gray-500">{{ selectedTask.assigned_to ? selectedTask.assigned_to.email : '-' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <p class="mt-1">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="statusClass(selectedTask.status)"
                  >
                    {{ statusLabel(selectedTask.status) }}
                  </span>
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Tanggal Dibuat</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTask.created_at) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Jatuh Tempo</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTask.due_date) }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTask.description }}</p>
            </div>

            <div class="flex justify-end">
              <button 
                @click="showViewTask = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="user?.role === 'konsultan_tani'">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Daftar Tugas Saya</h2>
      </div>
      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in filteredTasksKonsultan" :key="task.id">
                <td class="px-6 py-4">{{ task.title }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="priorityClass(task.priority)">
                    {{ priorityLabel(task.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="statusClass(task.status)">
                    {{ statusLabel(task.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ formatDate(task.due_date) }}</td>
                <td class="px-6 py-4 space-x-2">
                  <button @click="handleViewTask(task)" class="text-primary-600 hover:text-primary-900">Lihat</button>
                  <button v-if="task.status !== 'completed'" @click="markTaskDone(task)" class="text-green-600 hover:text-green-900">Selesai</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Modal detail tugas -->
      <div v-if="showViewTask && selectedTask" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Detail Tugas</h3>
            <button @click="showViewTask = false" class="text-gray-400 hover:text-gray-500">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Judul</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTask.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Prioritas</label>
                <p class="mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="priorityClass(selectedTask.priority)">
                    {{ priorityLabel(selectedTask.priority) }}
                  </span>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <p class="mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="statusClass(selectedTask.status)">
                    {{ statusLabel(selectedTask.status) }}
                  </span>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jatuh Tempo</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTask.due_date) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTask.description }}</p>
            </div>
            <div class="flex justify-end">
              <button @click="showViewTask = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import StatCard from '../components/StatCard.vue'
import CreateTaskForm from '../components/CreateTaskForm.vue'
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import axios from '../plugins/axios'

interface Task {
  id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  due_date: string
  assigned_to: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Consultant {
  id: number
  name: string
  email: string
  phone: string
  status: string
}

const filters = reactive({
  status: '',
  priority: '',
  assigned_to: '',
  due_date: ''
})

const taskStats = reactive({
  total: 0,
  in_progress: 0,
  completed: 0,
  overdue: 0
})

const tasks = ref<Task[]>([])
const consultants = ref<Consultant[]>([])
const showCreateTask = ref(false)
const showViewTask = ref(false)
const selectedTask = ref<Task | null>(null)
const showEditTask = ref(false)
const editTaskData = ref<Task | null>(null)
const authStore = useAuthStore()
const user = authStore.user

onMounted(async () => {
  try {
    const response = await axios.get('/tasks')
    tasks.value = response.data.data
    
    // Hitung statistik
    taskStats.total = tasks.value.length
    taskStats.in_progress = tasks.value.filter(t => t.status === 'in_progress').length
    taskStats.completed = tasks.value.filter(t => t.status === 'completed').length
    taskStats.overdue = tasks.value.filter(t => t.status === 'overdue').length
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
})

const filteredTasks = computed(() => {
  let filtered = tasks.value

  // Filter berdasarkan role pengguna
  if (user?.role === 'konsultan_tani') {
    filtered = filtered.filter(task => task.assigned_to && task.assigned_to.id === user.id)
  }

  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status)
  }

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority)
  }

  if (filters.assigned_to) {
    filtered = filtered.filter(task => task.assigned_to && task.assigned_to.id === parseInt(filters.assigned_to))
  }

  if (filters.due_date) {
    filtered = filtered.filter(task => task.due_date === filters.due_date)
  }

  return filtered
})

const priorityClass = (priority: Task['priority']) => {
  const classes = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[priority]
}

const priorityLabel = (priority: Task['priority']) => {
  const labels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi'
  }
  return labels[priority]
}

const statusClass = (status: Task['status']) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const statusLabel = (status: Task['status']) => {
  const labels = {
    pending: 'Pending',
    in_progress: 'Dalam Pengerjaan',
    completed: 'Selesai',
    overdue: 'Terlambat'
  }
  return labels[status]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const handleCreateTask = async (data: any) => {
  try {
    const response = await axios.post('/tasks', data)
    tasks.value.push(response.data.data)
    showCreateTask.value = false
  } catch (error) {
    console.error('Gagal membuat tugas:', error)
  }
}

const handleViewTask = (task: Task) => {
  selectedTask.value = task
  showViewTask.value = true
}

const handleEditTask = (task: Task) => {
  editTaskData.value = { ...task }
  showEditTask.value = true
}

const handleUpdateTask = async (data: any) => {
  try {
    const response = await axios.put(`/tasks/${data.id}`, data)
    // Update task di list
    const idx = tasks.value.findIndex(t => t.id === data.id)
    if (idx !== -1) {
      tasks.value[idx] = response.data.data
    }
    showEditTask.value = false
  } catch (error) {
    console.error('Gagal mengupdate tugas:', error)
  }
}

const handleDeleteTask = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
    try {
      await axios.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Gagal menghapus tugas:', error)
    }
  }
}

const filteredTasksKonsultan = computed(() => tasks.value.filter((task: Task) => task.assigned_to && task.assigned_to.id === user?.id))

const markTaskDone = async (task: Task) => {
  try {
    const response = await axios.put(`/tasks/${task.id}`, { status: 'completed' })
    // Update status di local tasks agar langsung berubah di tampilan
    const idx = tasks.value.findIndex(t => t.id === task.id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], status: 'completed' }
    }
  } catch (err) {
    console.error('Gagal menandai tugas selesai:', err)
  }
}
</script> 