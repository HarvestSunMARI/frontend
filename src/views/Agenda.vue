<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Tambah Agenda
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kalender -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Kalender Agenda</h2>
            <div class="flex space-x-2">
              <button class="btn-secondary">
                <ChevronLeftIcon class="w-5 h-5" />
              </button>
              <button class="btn-secondary">
                <ChevronRightIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" 
                 :key="day" 
                 class="text-center text-sm font-medium text-gray-500 py-2">
              {{ day }}
            </div>
            <div v-for="date in calendarDates" 
                 :key="date.date" 
                 class="aspect-square p-2 border border-gray-200 rounded-lg"
                 :class="{
                   'bg-primary-50': date.hasEvent,
                   'text-gray-400': !date.isCurrentMonth
                 }">
              <div class="text-sm">{{ date.date }}</div>
              <div v-if="date.hasEvent" class="mt-1">
                <div class="w-2 h-2 bg-primary-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daftar Agenda -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Agenda Hari Ini</h2>
          <div class="space-y-4">
            <div v-for="event in todayEvents" 
                 :key="event.id" 
                 class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ event.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ event.time }}</p>
                  <p class="text-sm text-gray-600">{{ event.location }}</p>
                </div>
                <span :class="eventStatusClass(event.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ event.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Agenda Mendatang</h2>
          <div class="space-y-4">
            <div v-for="event in upcomingEvents" 
                 :key="event.id" 
                 class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ event.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ event.date }}</p>
                  <p class="text-sm text-gray-600">{{ event.location }}</p>
                </div>
                <span :class="eventStatusClass(event.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ event.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PlusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  status: 'upcoming' | 'in_progress' | 'completed'
}

const todayEvents = ref<Event[]>([
  {
    id: 1,
    title: 'Pemeriksaan Lahan Padi',
    date: '2024-02-20',
    time: '09:00 - 11:00',
    location: 'Lahan A',
    status: 'in_progress'
  },
  {
    id: 2,
    title: 'Pemberian Pupuk',
    date: '2024-02-20',
    time: '13:00 - 15:00',
    location: 'Lahan B',
    status: 'upcoming'
  }
])

const upcomingEvents = ref<Event[]>([
  {
    id: 3,
    title: 'Panen Jagung',
    date: '2024-02-22',
    time: '08:00 - 12:00',
    location: 'Lahan C',
    status: 'upcoming'
  },
  {
    id: 4,
    title: 'Pemeliharaan Irigasi',
    date: '2024-02-23',
    time: '10:00 - 14:00',
    location: 'Semua Lahan',
    status: 'upcoming'
  }
])

const calendarDates = computed(() => {
  const dates = []
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDay)
    date.setDate(date.getDate() - i)
    dates.push({
      date: date.getDate(),
      isCurrentMonth: false,
      hasEvent: false
    })
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push({
      date: i,
      isCurrentMonth: true,
      hasEvent: Math.random() > 0.7 // Random events for demo
    })
  }
  
  // Add days from next month
  const remainingDays = 42 - dates.length // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(lastDay)
    date.setDate(date.getDate() + i)
    dates.push({
      date: date.getDate(),
      isCurrentMonth: false,
      hasEvent: false
    })
  }
  
  return dates
})

const eventStatusClass = (status: Event['status']) => {
  const classes = {
    upcoming: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status]
}
</script> 