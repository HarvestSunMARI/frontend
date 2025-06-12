<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Account Settings</h2>
      <button class="btn-primary">
        <CheckIcon class="w-4 h-4 mr-2" />
        Save Changes
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="card">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === tab.id 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Profile Settings -->
      <div v-if="activeTab === 'profile'" class="p-6 space-y-6">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img 
              :src="userProfile.avatar" 
              :alt="userProfile.name" 
              class="w-24 h-24 rounded-full object-cover"
            >
            <button class="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
              <CameraIcon class="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Profile Photo</h3>
            <p class="text-sm text-gray-500">Update your profile picture</p>
            <div class="mt-2 flex space-x-2">
              <button class="btn-secondary text-sm">Upload New</button>
              <button class="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              v-model="userProfile.name"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              v-model="userProfile.email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              v-model="userProfile.phone"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input 
              type="text" 
              :value="userProfile.role.replace('_', ' ')"
              disabled
              class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea 
              v-model="userProfile.address"
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="p-6 space-y-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Change Password</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                v-model="passwordForm.current"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div></div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.new"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.confirm"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
          </div>
          
          <button class="btn-primary">Update Password</button>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          
          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">SMS Authentication</p>
              <p class="text-sm text-gray-500">Receive verification codes via SMS</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="securitySettings.smsAuth" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mt-4">
            <div>
              <p class="font-medium text-gray-900">Email Authentication</p>
              <p class="text-sm text-gray-500">Receive verification codes via email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="securitySettings.emailAuth" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div v-if="activeTab === 'notifications'" class="p-6 space-y-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Email Notifications</h3>
          
          <div class="space-y-4">
            <div 
              v-for="notification in emailNotifications" 
              :key="notification.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-500">{{ notification.description }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notification.enabled" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
          
          <div class="space-y-4">
            <div 
              v-for="notification in pushNotifications" 
              :key="notification.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-500">{{ notification.description }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notification.enabled" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div v-if="activeTab === 'preferences'" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select 
              v-model="preferences.language"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select 
              v-model="preferences.timezone"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select 
              v-model="preferences.dateFormat"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select 
              v-model="preferences.theme"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Dashboard Preferences</h3>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="preferences.showWeatherWidget" class="rounded">
              <span class="text-sm text-gray-700">Show weather widget on dashboard</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="preferences.autoRefresh" class="rounded">
              <span class="text-sm text-gray-700">Auto-refresh dashboard data</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="preferences.compactView" class="rounded">
              <span class="text-sm text-gray-700">Use compact view for tables</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  CheckIcon,
  CameraIcon
} from '@heroicons/vue/24/outline'

const { user } = useAuthStore()

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'security', name: 'Security' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'preferences', name: 'Preferences' }
]

const userProfile = reactive({
  name: user.value?.name || 'John Doe',
  email: user.value?.email || 'john@harvestsun.com',
  phone: '+62 812 3456 7890',
  role: user.value?.role || 'konsultan_tani',
  address: 'Jl. Pertanian No. 123, Bogor, Jawa Barat',
  avatar: user.value?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const securitySettings = reactive({
  smsAuth: false,
  emailAuth: true
})

const emailNotifications = reactive([
  {
    id: 1,
    title: 'Task Reminders',
    description: 'Get notified about upcoming tasks and deadlines',
    enabled: true
  },
  {
    id: 2,
    title: 'Weather Alerts',
    description: 'Receive weather warnings and updates',
    enabled: true
  },
  {
    id: 3,
    title: 'Harvest Reports',
    description: 'Get notified when harvest reports are submitted',
    enabled: false
  },
  {
    id: 4,
    title: 'System Updates',
    description: 'Receive notifications about system maintenance',
    enabled: true
  }
])

const pushNotifications = reactive([
  {
    id: 1,
    title: 'Urgent Alerts',
    description: 'Critical notifications that require immediate attention',
    enabled: true
  },
  {
    id: 2,
    title: 'Daily Summary',
    description: 'Daily summary of field activities and tasks',
    enabled: false
  },
  {
    id: 3,
    title: 'New Messages',
    description: 'Notifications for new messages and communications',
    enabled: true
  }
])

const preferences = reactive({
  language: 'id',
  timezone: 'Asia/Jakarta',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  showWeatherWidget: true,
  autoRefresh: true,
  compactView: false
})
</script>