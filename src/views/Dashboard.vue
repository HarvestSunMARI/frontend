<template>
  <div class="space-y-6">
    <!-- Welcome Message -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">
        Welcome back, {{ user?.name }}!
      </h2>
      <p class="text-primary-100">
        {{ welcomeMessage }}
      </p>
    </div>

    <!-- Role-specific Dashboard Content -->
    <KonsultanTaniDashboard v-if="user?.role === 'konsultan_tani'" />
    <PenyuluhDashboard v-else-if="user?.role === 'penyuluh'" />
    <AdminDashboard v-else-if="user?.role === 'admin'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import KonsultanTaniDashboard from '@/components/dashboards/KonsultanTaniDashboard.vue'
import PenyuluhDashboard from '@/components/dashboards/PenyuluhDashboard.vue'
import AdminDashboard from '@/components/dashboards/AdminDashboard.vue'

const { user } = useAuthStore()

const welcomeMessage = computed(() => {
  const role = user.value?.role
  const messages = {
    konsultan_tani: "Check your field assignments and today's weather conditions.",
    penyuluh: "Review your consultants' activities and regional performance.",
    admin: "Monitor platform health and user activities."
  }
  return messages[role || 'konsultan_tani']
})
</script>