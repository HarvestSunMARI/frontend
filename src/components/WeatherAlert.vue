<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Weather Alerts</h3>
      <CloudIcon class="w-6 h-6 text-gray-400" />
    </div>
    
    <div class="space-y-3">
      <div 
        v-for="alert in alerts" 
        :key="alert.id"
        class="flex items-start space-x-3 p-3 rounded-lg"
        :class="alertBgClass(alert.severity)"
      >
        <component 
          :is="alertIcon(alert.type)" 
          class="w-5 h-5 mt-0.5" 
          :class="alertIconClass(alert.severity)"
        />
        <div class="flex-1">
          <p class="font-medium" :class="alertTextClass(alert.severity)">
            {{ alert.message }}
          </p>
          <p class="text-sm text-gray-500">
            {{ alert.location }} • {{ formatTime(alert.timestamp) }}
          </p>
        </div>
      </div>
      
      <div v-if="alerts.length === 0" class="text-center py-8 text-gray-500">
        <CloudIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No weather alerts at this time</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherAlert } from '@/types'
import { 
  CloudIcon, 
  SunIcon, 
  BoltIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  alerts: WeatherAlert[]
}

const props = defineProps<Props>()

const alertIcon = (type: WeatherAlert['type']) => {
  const icons = {
    rain: CloudIcon,
    drought: SunIcon,
    storm: BoltIcon,
    heat: ExclamationTriangleIcon
  }
  return icons[type]
}

const alertBgClass = (severity: WeatherAlert['severity']) => {
  const classes = {
    low: 'bg-blue-50 border border-blue-200',
    medium: 'bg-yellow-50 border border-yellow-200',
    high: 'bg-red-50 border border-red-200'
  }
  return classes[severity]
}

const alertIconClass = (severity: WeatherAlert['severity']) => {
  const classes = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  }
  return classes[severity]
}

const alertTextClass = (severity: WeatherAlert['severity']) => {
  const classes = {
    low: 'text-blue-900',
    medium: 'text-yellow-900',
    high: 'text-red-900'
  }
  return classes[severity]
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