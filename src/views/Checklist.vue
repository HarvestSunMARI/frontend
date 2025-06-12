<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Field Checklist</h2>
      <button class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Checklist Item
      </button>
    </div>

    <!-- Checklist Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daily Tasks -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Daily Tasks</h3>
          <div class="text-sm text-gray-500">
            {{ completedDaily }}/{{ dailyTasks.length }} completed
          </div>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="task in dailyTasks" 
            :key="task.id"
            class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <input 
              type="checkbox" 
              v-model="task.completed"
              class="w-5 h-5 text-primary-600 rounded mt-0.5"
            >
            <div class="flex-1">
              <p 
                class="font-medium"
                :class="task.completed ? 'line-through text-gray-500' : 'text-gray-900'"
              >
                {{ task.title }}
              </p>
              <p class="text-sm text-gray-600">{{ task.description }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="priorityClass(task.priority)"
                >
                  {{ task.priority }} priority
                </span>
                <span class="text-xs text-gray-500">{{ task.field }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Tasks -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Weekly Tasks</h3>
          <div class="text-sm text-gray-500">
            {{ completedWeekly }}/{{ weeklyTasks.length }} completed
          </div>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="task in weeklyTasks" 
            :key="task.id"
            class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <input 
              type="checkbox" 
              v-model="task.completed"
              class="w-5 h-5 text-primary-600 rounded mt-0.5"
            >
            <div class="flex-1">
              <p 
                class="font-medium"
                :class="task.completed ? 'line-through text-gray-500' : 'text-gray-900'"
              >
                {{ task.title }}
              </p>
              <p class="text-sm text-gray-600">{{ task.description }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="priorityClass(task.priority)"
                >
                  {{ task.priority }} priority
                </span>
                <span class="text-xs text-gray-500">Due: {{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card text-center">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon class="w-8 h-8 text-primary-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ totalCompleted }}</p>
        <p class="text-sm text-gray-500">Tasks Completed Today</p>
      </div>
      
      <div class="card text-center">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClockIcon class="w-8 h-8 text-yellow-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ totalPending }}</p>
        <p class="text-sm text-gray-500">Pending Tasks</p>
      </div>
      
      <div class="card text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon class="w-8 h-8 text-green-600" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ completionRate }}%</p>
        <p class="text-sm text-gray-500">Completion Rate</p>
      </div>
    </div>

    <!-- Monthly Maintenance -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Monthly Maintenance Schedule</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
                </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in monthlyTasks" :key="task.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                <div class="text-sm text-gray-500">{{ task.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ task.field }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(task.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="statusClass(task.status)"
                >
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="toggleTaskStatus(task)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  {{ task.status === 'completed' ? 'Mark Pending' : 'Mark Complete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

interface ChecklistTask {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  field: string
  dueDate?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

const dailyTasks = reactive<ChecklistTask[]>([
  {
    id: 1,
    title: 'Check irrigation system',
    description: 'Inspect water flow and pressure in all zones',
    completed: true,
    priority: 'high',
    field: 'Field A'
  },
  {
    id: 2,
    title: 'Monitor plant growth',
    description: 'Check for new growth and health indicators',
    completed: false,
    priority: 'medium',
    field: 'Field B'
  },
  {
    id: 3,
    title: 'Weather data recording',
    description: 'Record temperature, humidity, and rainfall',
    completed: true,
    priority: 'medium',
    field: 'All Fields'
  },
  {
    id: 4,
    title: 'Pest inspection',
    description: 'Look for signs of pest activity or damage',
    completed: false,
    priority: 'high',
    field: 'Field C'
  }
])

const weeklyTasks = reactive<ChecklistTask[]>([
  {
    id: 5,
    title: 'Soil pH testing',
    description: 'Test soil pH levels in all designated areas',
    completed: false,
    priority: 'medium',
    field: 'All Fields',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    title: 'Equipment maintenance',
    description: 'Service and clean all farming equipment',
    completed: true,
    priority: 'high',
    field: 'Equipment Shed',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    title: 'Nutrient application',
    description: 'Apply scheduled fertilizers according to plan',
    completed: false,
    priority: 'high',
    field: 'Field D',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  }
])

const monthlyTasks = reactive<ChecklistTask[]>([
  {
    id: 8,
    title: 'Deep soil analysis',
    description: 'Comprehensive soil testing for nutrients and composition',
    completed: false,
    priority: 'medium',
    field: 'Field A',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 9,
    title: 'Irrigation system overhaul',
    description: 'Complete maintenance of irrigation infrastructure',
    completed: false,
    priority: 'high',
    field: 'All Fields',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress'
  },
  {
    id: 10,
    title: 'Crop rotation planning',
    description: 'Plan next season crop rotation strategy',
    completed: true,
    priority: 'medium',
    field: 'Field B',
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  }
])

const completedDaily = computed(() => 
  dailyTasks.filter(task => task.completed).length
)

const completedWeekly = computed(() => 
  weeklyTasks.filter(task => task.completed).length
)

const totalCompleted = computed(() => 
  dailyTasks.filter(task => task.completed).length + 
  weeklyTasks.filter(task => task.completed).length
)

const totalPending = computed(() => 
  dailyTasks.filter(task => !task.completed).length + 
  weeklyTasks.filter(task => !task.completed).length
)

const completionRate = computed(() => {
  const total = dailyTasks.length + weeklyTasks.length
  const completed = totalCompleted.value
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const priorityClass = (priority: ChecklistTask['priority']) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority]
}

const statusClass = (status: ChecklistTask['status']) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status || 'pending']
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const toggleTaskStatus = (task: ChecklistTask) => {
  if (task.status === 'completed') {
    task.status = 'pending'
    task.completed = false
  } else {
    task.status = 'completed'
    task.completed = true
  }
}
</script>