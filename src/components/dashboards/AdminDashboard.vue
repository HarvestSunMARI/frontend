<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Users"
        :value="dashboardData.totalUsers"
        :icon="UsersIcon"
        color="primary"
        change="+5 new this week"
        change-type="positive"
      />
      <StatCard
        label="System Health"
        :value="dashboardData.systemHealth + '%'"
        :icon="CpuChipIcon"
        color="earth"
        change="All systems operational"
        change-type="positive"
      />
      <StatCard
        label="Total Reports"
        :value="dashboardData.totalReports"
        :icon="DocumentTextIcon"
        color="yellow"
        change="+12 today"
        change-type="positive"
      />
      <StatCard
        label="Active Sessions"
        :value="dashboardData.activeSessions"
        :icon="GlobeAltIcon"
        color="blue"
        change="Peak: 89 users"
        change-type="neutral"
      />
    </div>

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- User Analytics -->
        <DashboardCard title="User Distribution" :icon="ChartPieIcon">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-primary-50 rounded-lg">
              <p class="text-2xl font-bold text-primary-600">{{ userStats.konsultan_tani }}</p>
              <p class="text-sm text-gray-600">Konsultan Tani</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600">{{ userStats.penyuluh }}</p>
              <p class="text-sm text-gray-600">Penyuluh</p>
            </div>
            <div class="text-center p-4 bg-earth-50 rounded-lg">
              <p class="text-2xl font-bold text-earth-600">{{ userStats.admin }}</p>
              <p class="text-sm text-gray-600">Admin</p>
            </div>
          </div>
          
          <!-- Activity Chart -->
          <div class="h-48 flex items-end space-x-2">
            <div 
              v-for="(value, index) in activityData" 
              :key="index"
              class="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
              :style="{ height: `${(value / Math.max(...activityData)) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-4 text-sm text-gray-500">
            <span v-for="day in days" :key="day">{{ day }}</span>
          </div>
        </DashboardCard>
        
        <!-- System Activity Log -->
        <DashboardCard title="Latest System Activities" :icon="DocumentMagnifyingGlassIcon">
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div 
              v-for="log in systemLogs" 
              :key="log.id"
              class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="logTypeClass(log.type)"
              >
                <component :is="logTypeIcon(log.type)" class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ log.action }}</p>
                <p class="text-sm text-gray-600">{{ log.details }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(log.timestamp) }} by {{ log.user }}</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- Platform Metrics -->
        <DashboardCard title="Platform Metrics" :icon="ChartBarIcon">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <p class="text-xl font-bold text-green-600">{{ platformMetrics.totalHarvest }} ton</p>
              <p class="text-sm text-gray-500">Total Harvest</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-blue-600">{{ platformMetrics.totalFields }}</p>
              <p class="text-sm text-gray-500">Managed Fields</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-yellow-600">{{ platformMetrics.totalReports }}</p>
              <p class="text-sm text-gray-500">Reports Generated</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-purple-600">{{ platformMetrics.avgYield }} t/ha</p>
              <p class="text-sm text-gray-500">Average Yield</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- System Status -->
        <DashboardCard title="System Status" :icon="ServerIcon">
          <div class="space-y-4">
            <div 
              v-for="service in systemStatus" 
              :key="service.name"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ service.name }}</p>
                <p class="text-sm text-gray-500">{{ service.description }}</p>
              </div>
              <div 
                class="w-3 h-3 rounded-full"
                :class="service.status === 'online' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
            </div>
          </div>
        </DashboardCard>
        
        <!-- Quick Management Tools -->
        <DashboardCard title="Quick Actions" :icon="WrenchScrewdriverIcon">
          <div class="space-y-3">
            <button class="w-full btn-primary">
              Add New User
            </button>
            <button class="w-full btn-secondary">
              Generate System Report
            </button>
            <button class="w-full btn-secondary">
              Database Backup
            </button>
            <button class="w-full btn-secondary">
              Clear Cache
            </button>
          </div>
        </DashboardCard>

        <!-- Recent User Activity -->
        <DashboardCard title="Recent Logins" :icon="ClockIcon">
          <div class="space-y-3">
            <div 
              v-for="login in recentLogins" 
              :key="login.id"
              class="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg"
            >
              <img 
                :src="login.avatar" 
                :alt="login.name" 
                class="w-8 h-8 rounded-full object-cover"
              >
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">{{ login.name }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(login.loginTime) }}</p>
              </div>
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="roleClass(login.role as any)"
              >
                {{ login.role.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { User } from '@/types'
import StatCard from '@/components/StatCard.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import {
  UsersIcon,
  CpuChipIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ChartPieIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  ServerIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  UserPlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const dashboardData = reactive({
  totalUsers: 127,
  systemHealth: 98,
  totalReports: 1456,
  activeSessions: 34
})

const userStats = reactive({
  konsultan_tani: 89,
  penyuluh: 32,
  admin: 6
})

const activityData = ref([45, 52, 48, 61, 55, 67, 59])
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const systemLogs = ref([
  {
    id: 1,
    type: 'user',
    action: 'New user registered',
    details: 'John Doe registered as Konsultan Tani',
    timestamp: new Date().toISOString(),
    user: 'System'
  },
  {
    id: 2,
    type: 'edit',
    action: 'User profile updated',
    details: 'Jane Smith updated her profile information',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'Jane Smith'
  },
  {
    id: 3,
    type: 'delete',
    action: 'Report deleted',
    details: 'Field report #1234 was deleted by admin',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: 'Admin'
  },
  {
    id: 4,
    type: 'warning',
    action: 'System warning',
    details: 'High CPU usage detected on server 2',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: 'System Monitor'
  }
])

const platformMetrics = reactive({
  totalHarvest: 2456,
  totalFields: 342,
  totalReports: 1456,
  avgYield: 8.7
})

const systemStatus = ref([
  { name: 'Database', description: 'PostgreSQL Server', status: 'online' },
  { name: 'API Server', description: 'Laravel Backend', status: 'online' },
  { name: 'File Storage', description: 'AWS S3 Bucket', status: 'online' },
  { name: 'Cache', description: 'Redis Server', status: 'online' }
])

const recentLogins = ref([
  {
    id: 1,
    name: 'John Doe',
    role: 'konsultan_tani',
    loginTime: new Date().toISOString(),
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'penyuluh',
    loginTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'admin',
    loginTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
])

const logTypeIcon = (type: string) => {
  const icons = {
    user: UserPlusIcon,
    edit: PencilIcon,
    delete: TrashIcon,
    warning: ExclamationTriangleIcon
  }
  return icons[type] || DocumentTextIcon
}

const logTypeClass = (type: string) => {
  const classes = {
    user: 'bg-green-100 text-green-600',
    edit: 'bg-blue-100 text-blue-600',
    delete: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const roleClass = (role: User['role']) => {
  const classes = {
    konsultan_tani: 'bg-primary-100 text-primary-800',
    penyuluh: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-earth-100 text-earth-800'
  }
  return classes[role]
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
}
</script>