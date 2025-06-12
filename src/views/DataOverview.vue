<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Data Overview</h2>
      <div class="flex space-x-2">
        <button class="btn-secondary">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Refresh Data
        </button>
        <button class="btn-primary">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Harvest"
        :value="metrics.totalHarvest + ' tons'"
        :icon="TruckIcon"
        color="primary"
        change="+12% from last month"
        change-type="positive"
      />
      <StatCard
        label="Active Fields"
        :value="metrics.activeFields"
        :icon="HomeIcon"
        color="earth"
        change="3 new this week"
        change-type="positive"
      />
      <StatCard
        label="Total Users"
        :value="metrics.totalUsers"
        :icon="UsersIcon"
        color="yellow"
        change="+5 new users"
        change-type="positive"
      />
      <StatCard
        label="Reports Generated"
        :value="metrics.reportsGenerated"
        :icon="DocumentTextIcon"
        color="blue"
        change="+18% this month"
        change-type="positive"
      />
    </div>

    <!-- Charts and Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Harvest Trends -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Harvest Trends</h3>
        
        <div class="h-64 flex items-end space-x-2 mb-4">
          <div 
            v-for="(value, index) in harvestData" 
            :key="index"
            class="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg"
            :style="{ height: `${(value / Math.max(...harvestData)) * 100}%` }"
          ></div>
        </div>
        
        <div class="flex justify-between text-sm text-gray-500">
          <span v-for="month in months" :key="month">{{ month }}</span>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ averageHarvest }} tons</p>
          <p class="text-sm text-gray-500">Monthly Average</p>
        </div>
      </div>

      <!-- User Activity -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
        
        <div class="h-64 flex items-end space-x-2 mb-4">
          <div 
            v-for="(value, index) in userActivityData" 
            :key="index"
            class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
            :style="{ height: `${(value / Math.max(...userActivityData)) * 100}%` }"
          ></div>
        </div>
        
        <div class="flex justify-between text-sm text-gray-500">
          <span v-for="day in days" :key="day">{{ day }}</span>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ averageActivity }}</p>
          <p class="text-sm text-gray-500">Daily Active Users</p>
        </div>
      </div>
    </div>

    <!-- Data Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Performing Fields -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Top Performing Fields</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yield (t/ha)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="field in topFields" :key="field.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ field.name }}</div>
                  <div class="text-sm text-gray-500">{{ field.crop }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ field.yield }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="statusClass(field.status)"
                  >
                    {{ field.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h3>
        
        <div class="space-y-4">
          <div 
            v-for="report in recentReports" 
            :key="report.id"
            class="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
          >
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="reportTypeClass(report.type)"
            >
              <component :is="reportTypeIcon(report.type)" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ report.title }}</p>
              <p class="text-xs text-gray-500">{{ report.author }} • {{ formatDate(report.date) }}</p>
            </div>
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="statusClass(report.status)"
            >
              {{ report.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">System Health & Performance</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ServerIcon class="w-8 h-8 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-green-600">99.8%</p>
          <p class="text-sm text-gray-500">Uptime</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CpuChipIcon class="w-8 h-8 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">45%</p>
          <p class="text-sm text-gray-500">CPU Usage</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CircleStackIcon class="w-8 h-8 text-yellow-600" />
          </div>
          <p class="text-2xl font-bold text-yellow-600">2.1GB</p>
          <p class="text-sm text-gray-500">Database Size</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClockIcon class="w-8 h-8 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">120ms</p>
          <p class="text-sm text-gray-500">Avg Response</p>
        </div>
      </div>
    </div>

    <!-- Data Summary -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Data Summary</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Field Data</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Fields</span>
              <span class="font-medium">{{ dataSummary.fields.total }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Active Fields</span>
              <span class="font-medium">{{ dataSummary.fields.active }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Area</span>
              <span class="font-medium">{{ dataSummary.fields.totalArea }} ha</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Avg Yield</span>
              <span class="font-medium">{{ dataSummary.fields.avgYield }} t/ha</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">User Data</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Konsultan Tani</span>
              <span class="font-medium">{{ dataSummary.users.konsultanTani }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Penyuluh</span>
              <span class="font-medium">{{ dataSummary.users.penyuluh }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Admin</span>
              <span class="font-medium">{{ dataSummary.users.admin }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Active Today</span>
              <span class="font-medium">{{ dataSummary.users.activeToday }}</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Report Data</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Reports</span>
              <span class="font-medium">{{ dataSummary.reports.total }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">This Month</span>
              <span class="font-medium">{{ dataSummary.reports.thisMonth }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Pending Review</span>
              <span class="font-medium">{{ dataSummary.reports.pending }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Approved</span>
              <span class="font-medium">{{ dataSummary.reports.approved }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  TruckIcon,
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ClockIcon,
  CloudIcon,
  BugAntIcon
} from '@heroicons/vue/24/outline'

interface FieldData {
  id: number
  name: string
  crop: string
  yield: number
  status: 'excellent' | 'good' | 'average'
}

interface ReportData {
  id: number
  title: string
  type: 'harvest' | 'field_condition' | 'weather' | 'pest'
  author: string
  date: string
  status: 'approved' | 'pending' | 'draft'
}

const metrics = reactive({
  totalHarvest: 2456,
  activeFields: 89,
  totalUsers: 127,
  reportsGenerated: 1456
})

const harvestData = ref([180, 220, 195, 240, 210, 265, 245, 280, 255, 290, 275, 310])
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const userActivityData = ref([45, 52, 48, 61, 55, 67, 59])
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const topFields = ref<FieldData[]>([
  { id: 1, name: 'Field Alpha', crop: 'Rice', yield: 9.2, status: 'excellent' },
  { id: 2, name: 'Field Beta', crop: 'Corn', yield: 8.8, status: 'excellent' },
  { id: 3, name: 'Field Gamma', crop: 'Wheat', yield: 8.5, status: 'good' },
  { id: 4, name: 'Field Delta', crop: 'Soybeans', yield: 8.1, status: 'good' },
  { id: 5, name: 'Field Epsilon', crop: 'Rice', yield: 7.9, status: 'average' }
])

const recentReports = ref<ReportData[]>([
  {
    id: 1,
    title: 'Monthly Harvest Summary',
    type: 'harvest',
    author: 'John Doe',
    date: new Date().toISOString(),
    status: 'approved'
  },
  {
    id: 2,
    title: 'Field Condition Assessment',
    type: 'field_condition',
    author: 'Jane Smith',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 3,
    title: 'Weather Impact Analysis',
    type: 'weather',
    author: 'Mike Johnson',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved'
  },
  {
    id: 4,
    title: 'Pest Control Report',
    type: 'pest',
    author: 'Sarah Wilson',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft'
  }
])

const dataSummary = reactive({
  fields: {
    total: 89,
    active: 76,
    totalArea: 1250,
    avgYield: 8.4
  },
  users: {
    konsultanTani: 89,
    penyuluh: 32,
    admin: 6,
    activeToday: 45
  },
  reports: {
    total: 1456,
    thisMonth: 124,
    pending: 18,
    approved: 1289
  }
})

const averageHarvest = computed(() => {
  const sum = harvestData.value.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / harvestData.value.length)
})

const averageActivity = computed(() => {
  const sum = userActivityData.value.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / userActivityData.value.length)
})

const statusClass = (status: string) => {
  const classes = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    average: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const reportTypeClass = (type: ReportData['type']) => {
  const classes = {
    harvest: 'bg-green-100 text-green-600',
    field_condition: 'bg-earth-100 text-earth-600',
    weather: 'bg-blue-100 text-blue-600',
    pest: 'bg-red-100 text-red-600'
  }
  return classes[type]
}

const reportTypeIcon = (type: ReportData['type']) => {
  const icons = {
    harvest: TruckIcon,
    field_condition: HomeIcon,
    weather: CloudIcon,
    pest: BugAntIcon
  }
  return icons[type]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  })
}
</script>