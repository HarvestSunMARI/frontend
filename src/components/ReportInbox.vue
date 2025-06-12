<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Report Inbox</h3>
      <div class="flex items-center space-x-2">
        <span 
          v-if="unreadCount > 0"
          class="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
        >
          {{ unreadCount }}
        </span>
        <DocumentTextIcon class="w-6 h-6 text-gray-400" />
      </div>
    </div>
    
    <div class="space-y-3 max-h-64 overflow-y-auto">
      <div 
        v-for="report in reports" 
        :key="report.id"
        class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
        :class="{ 'bg-blue-50 border-blue-200': !report.isRead }"
        @click="markAsRead(report.id)"
      >
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="reportTypeClass(report.type)"
        >
          <component :is="reportTypeIcon(report.type)" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <p class="font-medium text-gray-900">{{ report.title }}</p>
            <span class="text-xs text-gray-500">{{ formatTime(report.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ truncateContent(report.content) }}</p>
          <p class="text-xs text-gray-500 mt-1">by {{ report.author.name }}</p>
        </div>
        <div v-if="!report.isRead" class="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
      
      <div v-if="reports.length === 0" class="text-center py-8 text-gray-500">
        <DocumentTextIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No reports available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Report } from '@/types'
import { 
  DocumentTextIcon,
  HomeIcon,
  CloudIcon,
  BugAntIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'

interface Props {
  reports: Report[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'mark-read': [id: number]
}>()

const unreadCount = computed(() => 
  props.reports.filter(r => !r.isRead).length
)

const reportTypeIcon = (type: Report['type']) => {
  const icons = {
    harvest: TruckIcon,
    field_condition: HomeIcon,
    weather: CloudIcon,
    pest: BugAntIcon
  }
  return icons[type]
}

const reportTypeClass = (type: Report['type']) => {
  const classes = {
    harvest: 'bg-green-100 text-green-600',
    field_condition: 'bg-earth-100 text-earth-600',
    weather: 'bg-blue-100 text-blue-600',
    pest: 'bg-red-100 text-red-600'
  }
  return classes[type]
}

const markAsRead = (id: number) => {
  emit('mark-read', id)
}

const truncateContent = (content: string) => {
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>