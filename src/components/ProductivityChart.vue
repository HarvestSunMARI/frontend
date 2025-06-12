<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Weekly Productivity</h3>
      <ChartBarIcon class="w-6 h-6 text-gray-400" />
    </div>
    
    <div class="h-64 flex items-end space-x-2 mb-4">
      <div 
        v-for="(value, index) in data" 
        :key="index"
        class="flex-1 bg-primary-600 rounded-t-lg transition-all duration-300 hover:bg-primary-700"
        :style="{ height: `${(value / Math.max(...data)) * 100}%` }"
        :title="`${days[index]}: ${value}%`"
      ></div>
    </div>
    
    <div class="flex justify-between text-sm text-gray-500">
      <span v-for="day in days" :key="day">{{ day }}</span>
    </div>
    
    <div class="mt-4 text-center">
      <p class="text-2xl font-bold text-primary-600">{{ averageProductivity }}%</p>
      <p class="text-sm text-gray-500">Average This Week</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

interface Props {
  data: number[]
}

const props = defineProps<Props>()

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const averageProductivity = computed(() => {
  const sum = props.data.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / props.data.length)
})
</script>