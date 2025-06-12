<template>
  <div class="card">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconBgClass" class="w-12 h-12 rounded-lg flex items-center justify-center">
          <component :is="icon" :class="iconClass" class="w-6 h-6" />
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold" :class="valueClass">{{ value }}</p>
        <p v-if="change" class="text-sm" :class="changeClass">
          {{ change }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  icon: any
  color?: 'primary' | 'yellow' | 'earth' | 'red' | 'blue'
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  changeType: 'neutral'
})

const iconBgClass = computed(() => {
  const colors = {
    primary: 'bg-primary-100',
    yellow: 'bg-yellow-100',
    earth: 'bg-earth-100',
    red: 'bg-red-100',
    blue: 'bg-blue-100'
  }
  return colors[props.color]
})

const iconClass = computed(() => {
  const colors = {
    primary: 'text-primary-600',
    yellow: 'text-yellow-600',
    earth: 'text-earth-600',
    red: 'text-red-600',
    blue: 'text-blue-600'
  }
  return colors[props.color]
})

const valueClass = computed(() => {
  const colors = {
    primary: 'text-primary-900',
    yellow: 'text-yellow-900',
    earth: 'text-earth-900',
    red: 'text-red-900',
    blue: 'text-blue-900'
  }
  return colors[props.color]
})

const changeClass = computed(() => {
  const types = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  }
  return types[props.changeType]
})
</script>