<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">System Activity Logs</h2>
      <div class="flex space-x-2">
        <button class="btn-secondary">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export Logs
        </button>
        <button class="btn-secondary">
          <TrashIcon class="w-4 h-4 mr-2" />
          Clear Old Logs
        </button>
      </div>
    </div>

    <!-- Log Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        label="Total Logs"
        :value="logStats.total"
        :icon="DocumentMagnifyingGlassIcon"
        color="primary"
      />
      <StatCard
        label="Today's Activities"
        :value="logStats.today"
        :icon="ClockIcon"
        color="earth"
      />
      <StatCard
        label="Error Logs"
        :value="logStats.errors"
        :icon="ExclamationTriangleIcon"
        color="red"
      />
      <StatCard
        label="User Actions"
        :value="logStats.userActions"
        :icon="UserIcon"
        color="blue"
      />
    </div>

    <!-- Log Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
          <select v-model="filters.level" class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select v-model="filters.category" class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="user">User Management</option>
            <option value="field">Field Operations</option>
            <option value="report">Reports</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
          <select v-model="filters.user" class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="">All Users</option>
            <option v-for="user in users" :key="user.id" :value="user.name">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <input 
            type="date" 
            v-model="filters.dateFrom" 
            class="w-full p-2 border border-gray-300 rounded-lg"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
          <input 
            type="date" 
            v-model="filters.dateTo" 
            class="w-full p-2 border border-gray-300 rounded-lg"
          >
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="w-full btn-secondary">Clear Filters</button>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Activity Overview</h3>
      
      <div class="h-64 flex items-end space-x-2 mb-4">
        <div 
          v-for="(value, index) in activityData" 
          :key="index"
          class="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
          :style="{ height: `${(value / Math.max(...activityData)) * 100}%` }"
        ></div>
      </div>
      
      <div class="flex justify-between text-sm text-gray-500">
        <span v-for="day in days" :key="day">{{ day }}</span>
      </div>
      
      <div class="mt-4 grid grid-cols-4 gap-4 text-center">
        <div>
          <p class="text-xl font-bold text-blue-600">{{ totalActivities }}</p>
          <p class="text-sm text-gray-500">Total Activities</p>
        </div>
        <div>
          <p class="text-xl font-bold text-green-600">{{ successfulActions }}</p>
          <p class="text-sm text-gray-500">Successful</p>
        </div>
        <div>
          <p class="text-xl font-bold text-red-600">{{ failedActions }}</p>
          <p class="text-sm text-gray-500">Failed</p>
        </div>
        <div>
          <p class="text-xl font-bold text-yellow-600">{{ averageDaily }}</p>
          <p class="text-sm text-gray-500">Daily Average</p>
        </div>
      </div>
    </div>

    <!-- Activity Logs -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Activity Logs</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">{{ filteredLogs.length }} entries</span>
          <button 
            @click="refreshLogs"
            class="text-primary-600 hover:text-primary-900 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div 
          v-for="log in paginatedLogs" 
          :key="log.id"
          class="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="logLevelClass(log.level)"
          >
            <component :is="logLevelIcon(log.level)" class="w-5 h-5" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="categoryClass(log.category)"
              >
                {{ log.category }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mt-1">{{ log.description }}</p>
            
            <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{{ log.user }}</span>
              <span>{{ log.ipAddress }}</span>
              <span>{{ formatTime(log.timestamp) }}</span>
            </div>
            
            <div v-if="log.metadata" class="mt-2">
              <details class="text-xs">
                <summary class="cursor-pointer text-gray-500 hover:text-gray-700">
                  View Details
                </summary>
                <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredLogs.length) }} of {{ filteredLogs.length }} entries
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm">{{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import {
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BugAntIcon
} from '@heroicons/vue/24/outline'

interface LogEntry {
  id: number
  level: 'info' | 'warning' | 'error' | 'debug'
  category: 'auth' | 'user' | 'field' | 'report' | 'system'
  action: string
  description: string
  user: string
  ipAddress: string
  timestamp: string
  metadata?: any
}

interface User {
  id: number
  name: string
}

const currentPage = ref(1)
const pageSize = 20

const filters = reactive({
  level: '',
  category: '',
  user: '',
  dateFrom: '',
  dateTo: ''
})

const logStats = reactive({
  total: 15420,
  today: 234,
  errors: 12,
  userActions: 1890
})

const users = ref<User[]>([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Wilson' },
  { id: 5, name: 'David Brown' }
])

const logs = ref<LogEntry[]>([
  {
    id: 1,
    level: 'info',
    category: 'auth',
    action: 'User Login',
    description: 'User successfully logged into the system',
    user: 'John Doe',
    ipAddress: '192.168.1.100',
    timestamp: new Date().toISOString(),
    metadata: { userAgent: 'Mozilla/5.0...', sessionId: 'abc123' }
  },
  {
    id: 2,
    level: 'warning',
    category: 'user',
    action: 'Failed Login Attempt',
    description: 'Multiple failed login attempts detected',
    user: 'Unknown',
    ipAddress: '192.168.1.200',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: { attempts: 3, lastAttempt: '2024-01-15T10:30:00Z' }
  },
  {
    id: 3,
    level: 'info',
    category: 'field',
    action: 'Field Data Updated',
    description: 'Field A irrigation status updated',
    user: 'Jane Smith',
    ipAddress: '192.168.1.150',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { fieldId: 'field_a', previousStatus: 'inactive', newStatus: 'active' }
  },
  {
    id: 4,
    level: 'error',
    category: 'system',
    action: 'Database Connection Error',
    description: 'Failed to connect to database server',
    user: 'System',
    ipAddress: 'localhost',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metadata: { error: 'Connection timeout', retryCount: 3 }
  },
  {
    id: 5,
    level: 'info',
    category: 'report',
    action: 'Report Generated',
    description: 'Monthly harvest report generated successfully',
    user: 'Mike Johnson',
    ipAddress: '192.168.1.175',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    metadata: { reportType: 'harvest', period: '2024-01', recordCount: 156 }
  },
  {
    id: 6,
    level: 'debug',
    category: 'system',
    action: 'Cache Cleared',
    description: 'Application cache cleared by administrator',
    user: 'Admin',
    ipAddress: '192.168.1.1',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    metadata: { cacheSize: '45MB', clearTime: '2.3s' }
  },
  {
    id: 7,
    level: 'info',
    category: 'user',
    action: 'User Profile Updated',
    description: 'User profile information updated',
    user: 'Sarah Wilson',
    ipAddress: '192.168.1.180',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    metadata: { changedFields: ['phone', 'address'] }
  },
  {
    id: 8,
    level: 'warning',
    category: 'field',
    action: 'Weather Alert',
    description: 'Severe weather warning issued for Field B',
    user: 'Weather System',
    ipAddress: 'external',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    metadata: { alertType: 'storm', severity: 'high', affectedFields: ['field_b'] }
  }
])

const activityData = ref([45, 52, 48, 61, 55, 67, 59])
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const filteredLogs = computed(() => {
  let filtered = logs.value

  if (filters.level) {
    filtered = filtered.filter(log => log.level === filters.level)
  }

  if (filters.category) {
    filtered = filtered.filter(log => log.category === filters.category)
  }

  if (filters.user) {
    filtered = filtered.filter(log => log.user === filters.user)
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(log => 
      new Date(log.timestamp) >= new Date(filters.dateFrom)
    )
  }

  if (filters.dateTo) {
    filtered = filtered.filter(log => 
      new Date(log.timestamp) <= new Date(filters.dateTo)
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / pageSize)
})

const totalActivities = computed(() => {
  return activityData.value.reduce((acc, val) => acc + val, 0)
})

const successfulActions = computed(() => {
  return logs.value.filter(log => log.level === 'info').length
})

const failedActions = computed(() => {
  return logs.value.filter(log => log.level === 'error').length
})

const averageDaily = computed(() => {
  return Math.round(totalActivities.value / activityData.value.length)
})

const logLevelClass = (level: LogEntry['level']) => {
  const classes = {
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    debug: 'bg-gray-100 text-gray-600'
  }
  return classes[level]
}

const logLevelIcon = (level: LogEntry['level']) => {
  const icons = {
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    debug: BugAntIcon
  }
  return icons[level]
}

const categoryClass = (category: LogEntry['category']) => {
  const classes = {
    auth: 'bg-green-100 text-green-800',
    user: 'bg-blue-100 text-blue-800',
    field: 'bg-primary-100 text-primary-800',
    report: 'bg-purple-100 text-purple-800',
    system: 'bg-gray-100 text-gray-800'
  }
  return classes[category]
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const clearFilters = () => {
  filters.level = ''
  filters.category = ''
  filters.user = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
}

const refreshLogs = () => {
  console.log('Refreshing logs...')
  // Add logic to refresh logs from server
}
</script>