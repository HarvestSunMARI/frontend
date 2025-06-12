<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex space-x-2">
        <button 
          v-if="canAdd"
          @click="$emit('add-task')"
          class="btn-primary text-sm"
        >
          Add Task
        </button>
        <ListBulletIcon class="w-6 h-6 text-gray-400" />
      </div>
    </div>
    
    <div class="space-y-3">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <input 
          type="checkbox" 
          :checked="task.status === 'completed'"
          @change="toggleTask(task.id)"
          class="w-4 h-4 text-primary-600 rounded"
        >
        <div class="flex-1">
          <p 
            class="font-medium"
            :class="task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'"
          >
            {{ task.title }}
          </p>
          <p class="text-sm text-gray-500">{{ task.description }}</p>
          <div class="flex items-center space-x-4 mt-1">
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="statusClass(task.status)"
            >
              {{ task.status.replace('_', ' ') }}
            </span>
            <span class="text-xs text-gray-500">Due: {{ formatDate(task.dueDate) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
        <ListBulletIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No tasks available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types'
import { ListBulletIcon } from '@heroicons/vue/24/outline'

interface Props {
  tasks: Task[]
  title?: string
  canAdd?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Tasks',
  canAdd: false
})

const emit = defineEmits<{
  'add-task': []
  'toggle-task': [id: number]
}>()

const toggleTask = (id: number) => {
  emit('toggle-task', id)
}

const statusClass = (status: Task['status']) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  })
}
</script>