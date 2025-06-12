<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- User Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Pengguna"
          :value="userStats.total"
          :icon="UsersIcon"
          color="primary"
        />
        <StatCard
          label="Konsultan Tani"
          :value="userStats.konsultanTani"
          :icon="UserIcon"
          color="earth"
        />
        <StatCard
          label="Penyuluh"
          :value="userStats.penyuluh"
          :icon="AcademicCapIcon"
          color="yellow"
        />
        <StatCard
          label="Admin"
          :value="userStats.admin"
          :icon="ShieldCheckIcon"
          color="blue"
        />
      </div>

      <!-- User Filters -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select v-model="filters.role" class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Semua Role</option>
              <option value="konsultan_tani">Konsultan Tani</option>
              <option value="penyuluh">Penyuluh</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cari</label>
            <input 
              type="text" 
              v-model="filters.search"
              placeholder="Cari berdasarkan nama atau email..."
              class="w-full p-2 border border-gray-300 rounded-lg"
            >
          </div>
        </div>
      </div>

      <!-- User List -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Terakhir
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      :src="user.avatar || '/default-avatar.png'" 
                      :alt="user.name" 
                      class="w-10 h-10 rounded-full object-cover mr-4"
                    >
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="roleClass(user.role)"
                  >
                    {{ user.role.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="statusClass(user.status)"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(user.lastLogin) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(user.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import axios from '../plugins/axios'
import {
  PlusIcon,
  UsersIcon,
  UserIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

interface UserData {
  id: number
  name: string
  email: string
  role: 'konsultan_tani' | 'penyuluh' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  lastLogin: string
  createdAt: string
}

const loading = ref(true)
const error = ref('')
const users = ref<UserData[]>([])

const filters = reactive({
  role: '',
  status: '',
  search: ''
})

const userStats = computed(() => {
  const total = users.value.length
  const konsultanTani = users.value.filter(u => u.role === 'konsultan_tani').length
  const penyuluh = users.value.filter(u => u.role === 'penyuluh').length
  const admin = users.value.filter(u => u.role === 'admin').length

  return {
    total,
    konsultanTani,
    penyuluh,
    admin
  }
})

const filteredUsers = computed(() => {
  let filtered = users.value

  if (filters.role) {
    filtered = filtered.filter(user => user.role === filters.role)
  }

  if (filters.status) {
    filtered = filtered.filter(user => user.status === filters.status)
  }

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  return filtered
})

const roleClass = (role: UserData['role']) => {
  const classes = {
    konsultan_tani: 'bg-primary-100 text-primary-800',
    penyuluh: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-earth-100 text-earth-800'
  }
  return classes[role]
}

const statusClass = (status: UserData['status']) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
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

const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await axios.get('/users')
    users.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal mengambil data pengguna'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>