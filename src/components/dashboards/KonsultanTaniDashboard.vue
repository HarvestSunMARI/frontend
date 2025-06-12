<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Harvest This Month"
        :value="dashboardData.totalHarvest + ' ton'"
        :icon="TruckIcon"
        color="primary"
        change="+12% from last month"
        change-type="positive"
      />
      <StatCard
        label="Active Fields"
        :value="dashboardData.activeFields"
        :icon="HomeIcon"
        color="earth"
        change="2 ready for harvest"
        change-type="neutral"
      />
      <StatCard
        label="Pending Tasks"
        :value="dashboardData.pendingTasks"
        :icon="ClipboardDocumentListIcon"
        color="yellow"
        change="3 due today"
        change-type="negative"
      />
      <StatCard
        label="Reports Submitted"
        :value="dashboardData.reportsSubmitted"
        :icon="DocumentTextIcon"
        color="blue"
        change="+5 this week"
        change-type="positive"
      />
    </div>

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Weather Alerts -->
        <WeatherAlert :alerts="weatherAlerts" />
        
        <!-- Productivity Chart -->
        <ProductivityChart :data="productivityData" />
        
        <!-- Harvest Trend -->
        <DashboardCard title="Harvest Trend" :icon="ChartBarIcon">
          <div class="h-48 flex items-end space-x-2">
            <div 
              v-for="(value, index) in harvestTrend" 
              :key="index"
              class="flex-1 bg-primary-600 rounded-t-lg"
              :style="{ height: `${(value / Math.max(...harvestTrend)) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-4 text-sm text-gray-500">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
        </DashboardCard>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Field Map -->
        <FieldMap :fields="fieldData" title="My Fields" />
        
        <!-- Task List -->
        <TaskList 
          :tasks="tasks" 
          title="Weekly Checklist"
          @toggle-task="toggleTask"
        />
        
        <!-- Report Inbox -->
        <ReportInbox 
          :reports="reports"
          @mark-read="markReportAsRead"
        />
      </div>
    </div>

    <!-- Agenda Panel -->
    <DashboardCard title="Today's Agenda" :icon="CalendarIcon">
      <div class="space-y-3">
        <div 
          v-for="event in todayAgenda" 
          :key="event.id"
          class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
        >
          <div class="w-2 h-8 bg-primary-600 rounded-full"></div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ event.title }}</p>
            <p class="text-sm text-gray-500">{{ event.time }} - {{ event.location }}</p>
          </div>
        </div>
        
        <div v-if="todayAgenda.length === 0" class="text-center py-8 text-gray-500">
          <CalendarIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No events scheduled for today</p>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { WeatherAlert as WeatherAlertType, Task, Report, FieldData } from '@/types'
import StatCard from '@/components/StatCard.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import WeatherAlert from '@/components/WeatherAlert.vue'
import ProductivityChart from '@/components/ProductivityChart.vue'
import FieldMap from '@/components/FieldMap.vue'
import TaskList from '@/components/TaskList.vue'
import ReportInbox from '@/components/ReportInbox.vue'
import {
  TruckIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

// Dashboard data
const dashboardData = reactive({
  totalHarvest: 156,
  activeFields: 8,
  pendingTasks: 12,
  reportsSubmitted: 24
})

const weatherAlerts = ref<WeatherAlertType[]>([
  {
    id: 1,
    type: 'rain',
    message: 'Heavy rain expected in the next 6 hours',
    severity: 'medium',
    location: 'Field A & B',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'heat',
    message: 'High temperature warning for crops in Field C',
    severity: 'high',
    location: 'Field C',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
])

const productivityData = ref([85, 92, 78, 88, 95, 82, 90])

const harvestTrend = ref([120, 135, 110, 145, 156, 142])
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const fieldData = ref<FieldData[]>([
  { id: 1, name: 'Field A', area: 2.5, crop: 'Rice', location: [25, 30], status: 'active' },
  { id: 2, name: 'Field B', area: 3.2, crop: 'Corn', location: [45, 25], status: 'harvest_ready' },
  { id: 3, name: 'Field C', area: 1.8, crop: 'Wheat', location: [65, 45], status: 'active' },
  { id: 4, name: 'Field D', area: 2.1, crop: 'Soybeans', location: [35, 60], status: 'maintenance' },
  { id: 5, name: 'Field E', area: 4.0, crop: 'Rice', location: [70, 70], status: 'active' }
])

const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Check irrigation system',
    description: 'Inspect and test irrigation in Field A',
    status: 'pending',
    dueDate: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Fertilizer application',
    description: 'Apply nitrogen fertilizer to Field B',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'Pest inspection',
    description: 'Check for pest damage in Field C',
    status: 'completed',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
])

const reports = ref<Report[]>([
  {
    id: 1,
    title: 'Field A Harvest Report',
    type: 'harvest',
    content: 'Completed harvest of 2.5 hectares with yield of 8.2 tons per hectare.',
    author: { id: 1, name: 'Field Supervisor', email: 'supervisor@harvestsun.com', role: 'konsultan_tani' },
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    id: 2,
    title: 'Weather Impact Assessment',
    type: 'weather',
    content: 'Recent rainfall has improved soil moisture levels across all fields.',
    author: { id: 2, name: 'Weather Station', email: 'weather@harvestsun.com', role: 'konsultan_tani' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: true
  }
])

const todayAgenda = ref([
  {
    id: 1,
    title: 'Field Inspection',
    time: '08:00',
    location: 'Field A'
  },
  {
    id: 2,
    title: 'Fertilizer Application',
    time: '10:30',
    location: 'Field B'
  },
  {
    id: 3,
    title: 'Report Submission',
    time: '15:00',
    location: 'Office'
  }
])

const toggleTask = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed'
  }
}

const markReportAsRead = (reportId: number) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.isRead = true
  }
}
</script>