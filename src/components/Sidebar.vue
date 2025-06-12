<template>
  <div class="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">HS</span>
        </div>
        <div>
          <h2 class="font-bold text-gray-900">HarvestSun</h2>
          <p class="text-sm text-gray-500">Agriculture Platform</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in sidebarItems"
        :key="item.name"
        :to="item.path"
        class="sidebar-item"
        :class="{ 'active': $route.path === item.path }"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <img 
          :src="user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'" 
          :alt="user?.name" 
          class="w-10 h-10 rounded-full object-cover"
        >
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ user?.name }}</p>
          <p class="text-sm text-gray-500 capitalize">{{ user?.role?.replace('_', ' ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  MapIcon,
  CogIcon,
  UsersIcon,
  ListBulletIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = authStore.user

const sidebarItems = computed(() => {
  const role = authStore.user?.role
  
  const menus = {
    konsultan_tani: [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Tugas', path: '/tugas', icon: ListBulletIcon },
      { name: 'Agenda', path: '/agenda', icon: CalendarIcon },
      { name: 'Checklist', path: '/checklist', icon: ClipboardDocumentListIcon },
      { name: 'Laporan', path: '/laporan', icon: DocumentTextIcon },
      { name: 'Peta Lahan', path: '/peta-lahan', icon: MapIcon },
      { name: 'AI Assistant', path: '/ai-assistant', icon: SparklesIcon },
      { name: 'Pengaturan Akun', path: '/pengaturan', icon: CogIcon }
    ],
    penyuluh: [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Konsultan Tani', path: '/konsultan-tani', icon: UsersIcon },
      { name: 'Tugas', path: '/tugas', icon: ListBulletIcon },
      { name: 'Laporan', path: '/laporan', icon: DocumentTextIcon },
      { name: 'Peta Wilayah', path: '/peta-wilayah', icon: MapIcon },
      { name: 'AI Assistant', path: '/ai-assistant', icon: SparklesIcon },
      { name: 'Pengaturan Akun', path: '/pengaturan', icon: CogIcon }
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Manajemen Pengguna', path: '/manajemen-pengguna', icon: UsersIcon },
      { name: 'AI Assistant', path: '/ai-assistant', icon: SparklesIcon },
      { name: 'Pengaturan Akun', path: '/pengaturan', icon: CogIcon }
    ]
  }
  
  return menus[role || 'konsultan_tani'] || []
})
</script>