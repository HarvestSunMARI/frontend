<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Consultants"
        :value="dashboardData.totalConsultants"
        :icon="UsersIcon"
        color="primary"
        change="+2 new this month"
        change-type="positive"
      />
      <StatCard
        label="Regional Harvest"
        :value="dashboardData.regionalHarvest + ' ton'"
        :icon="TruckIcon"
        color="earth"
        change="+8% from last month"
        change-type="positive"
      />
      <StatCard
        label="Active Tasks"
        :value="dashboardData.activeTasks"
        :icon="ListBulletIcon"
        color="yellow"
        change="15 completed today"
        change-type="positive"
      />
      <StatCard
        label="Pending Reports"
        :value="dashboardData.pendingReports"
        :icon="DocumentTextIcon"
        color="blue"
        change="5 need review"
        change-type="neutral"
      />
    </div>

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Regional Performance Metrics -->
        <DashboardCard title="Regional Harvest Performance" :icon="ChartBarIcon">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">89%</p>
              <p class="text-sm text-gray-500">Target Achievement</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">456 ha</p>
              <p class="text-sm text-gray-500">Total Area Managed</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">12.5 t/ha</p>
              <p class="text-sm text-gray-500">Average Yield</p>
            </div>
          </div>
          
          <div class="h-48 flex items-end space-x-2">
            <div 
              v-for="(value, index) in performanceData" 
              :key="index"
              class="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
              :style="{ height: `${(value / Math.max(...performanceData)) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-4 text-sm text-gray-500">
            <span v-for="area in areas" :key="area">{{ area }}</span>
          </div>
        </DashboardCard>
        
        <!-- Consultant Activity Log -->
        <DashboardCard title="Consultant Activity Log" :icon="ClockIcon">
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div 
              v-for="activity in consultantActivities" 
              :key="activity.id"
              class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <component :is="activity.icon" class="w-5 h-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ activity.consultant }}</p>
                <p class="text-sm text-gray-600">{{ activity.action }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Regional Weather Alerts -->
        <WeatherAlert :alerts="weatherAlerts" />
        
        <!-- Regional Map -->
        <FieldMap :fields="regionalFields" title="Regional Overview" />
        
        <!-- Quick Actions -->
        <DashboardCard title="Quick Actions" :icon="BoltIcon">
          <div class="space-y-3">
            <button class="w-full btn-primary">
              Assign New Task
            </button>
            <button class="w-full btn-secondary">
              Generate Report
            </button>
            <button class="w-full btn-secondary">
              Schedule Inspection
            </button>
          </div>
        </DashboardCard>
      </div>
    </div>

    <!-- Reports Summary -->
    <DashboardCard title="Incoming Reports Summary" :icon="DocumentTextIcon">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          v-for="reportType in reportSummary" 
          :key="reportType.type"
          class="p-4 border border-gray-200 rounded-lg text-center"
        >
          <component :is="reportType.icon" class="w-8 h-8 mx-auto mb-2" :class="reportType.color" />
          <p class="text-2xl font-bold text-gray-900">{{ reportType.count }}</p>
          <p class="text-sm text-gray-500">{{ reportType.label }}</p>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { WeatherAlert as WeatherAlertType, FieldData } from '@/types'
import StatCard from '@/components/StatCard.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import WeatherAlert from '@/components/WeatherAlert.vue'
import FieldMap from '@/components/FieldMap.vue'
import {
  UsersIcon,
  TruckIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  BoltIcon,
  HomeIcon,
  CloudIcon,
  BugAntIcon
} from '@heroicons/vue/24/outline'

const dashboardData = reactive({
  totalConsultants: 15,
  regionalHarvest: 1250,
  activeTasks: 45,
  pendingReports: 18
})

const performanceData = ref([78, 85, 92, 88, 95, 82])
const areas = ['Area A', 'Area B', 'Area C', 'Area D', 'Area E', 'Area F']

const consultantActivities = ref([
  {
    id: 1,
    consultant: 'John Doe',
    action: 'Completed field inspection in Area A',
    timestamp: new Date().toISOString(),
    icon: HomeIcon
  },
  {
    id: 2,
    consultant: 'Jane Smith',
    action: 'Submitted harvest report for Field B-2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    icon: DocumentTextIcon
  },
  {
    id: 3,
    consultant: 'Mike Johnson',
    action: 'Applied fertilizer treatment in Area C',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: TruckIcon
  }
])

const weatherAlerts = ref<WeatherAlertType[]>([
  {
    id: 1,
    type: 'rain',
    message: 'Heavy rainfall warning across multiple areas',
    severity: 'high',
    location: 'Regional',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'drought',
    message: 'Dry conditions in southern region',
    severity: 'medium',
    location: 'South Region',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
])

const regionalFields = ref<FieldData[]>([
  { id: 1, name: 'Area A-1', area: 15.2, crop: 'Rice', location: [20, 25], status: 'active' },
  { id: 2, name: 'Area A-2', area: 18.5, crop: 'Corn', location: [40, 30], status: 'harvest_ready' },
  { id: 3, name: 'Area B-1', area: 12.8, crop: 'Wheat', location: [60, 40], status: 'active' },
  { id: 4, name: 'Area B-2', area: 20.1, crop: 'Soybeans', location: [25, 55], status: 'maintenance' },
  { id: 5, name: 'Area C-1', area: 25.0, crop: 'Rice', location: [75, 35], status: 'active' },
  { id: 6, name: 'Area C-2', area: 16.4, crop: 'Corn', location: [45, 70], status: 'harvest_ready' }
])

const reportSummary = ref([
  { type: 'harvest', label: 'Harvest Reports', count: 8, icon: TruckIcon, color: 'text-green-600' },
  { type: 'field', label: 'Field Conditions', count: 5, icon: HomeIcon, color: 'text-earth-600' },
  { type: 'weather', label: 'Weather Reports', count: 3, icon: CloudIcon, color: 'text-blue-600' },
  { type: 'pest', label: 'Pest Alerts', count: 2, icon: BugAntIcon, color: 'text-red-600' }
])

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
}
</script>