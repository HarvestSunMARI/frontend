<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Platform Settings</h2>
      <button class="btn-primary">
        <CheckIcon class="w-4 h-4 mr-2" />
        Save All Changes
      </button>
    </div>

    <!-- Settings Navigation -->
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

      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">General Platform Settings</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input 
                type="text" 
                v-model="generalSettings.platformName"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Platform URL</label>
              <input 
                type="url" 
                v-model="generalSettings.platformUrl"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select 
                v-model="generalSettings.defaultLanguage"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
              <select 
                v-model="generalSettings.defaultTimezone"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
              <textarea 
                v-model="generalSettings.description"
                rows="3"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">Platform Features</h4>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="generalSettings.enableRegistration" class="rounded">
              <span class="text-sm text-gray-700">Allow user registration</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="generalSettings.enableNotifications" class="rounded">
              <span class="text-sm text-gray-700">Enable push notifications</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="generalSettings.enableWeatherIntegration" class="rounded">
              <span class="text-sm text-gray-700">Enable weather data integration</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="generalSettings.enableMobileApp" class="rounded">
              <span class="text-sm text-gray-700">Enable mobile app access</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input 
                type="number" 
                v-model="securitySettings.sessionTimeout"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <input 
                type="number" 
                v-model="securitySettings.maxLoginAttempts"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
              <input 
                type="number" 
                v-model="securitySettings.passwordMinLength"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Account Lockout Duration (minutes)</label>
              <input 
                type="number" 
                v-model="securitySettings.lockoutDuration"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">Security Features</h4>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="securitySettings.requireTwoFactor" class="rounded">
              <span class="text-sm text-gray-700">Require two-factor authentication for admins</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="securitySettings.enablePasswordComplexity" class="rounded">
              <span class="text-sm text-gray-700">Enforce password complexity rules</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="securitySettings.enableAuditLog" class="rounded">
              <span class="text-sm text-gray-700">Enable detailed audit logging</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="securitySettings.enableIpWhitelist" class="rounded">
              <span class="text-sm text-gray-700">Enable IP address whitelisting</span>
            </label>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">API Security</h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (requests/minute)</label>
              <input 
                type="number" 
                v-model="securitySettings.apiRateLimit"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="securitySettings.enableApiKeyAuth" class="rounded">
              <span class="text-sm text-gray-700">Require API key authentication</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div v-if="activeTab === 'email'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Email Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input 
                type="text" 
                v-model="emailSettings.smtpHost"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
              <input 
                type="number" 
                v-model="emailSettings.smtpPort"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
              <input 
                type="text" 
                v-model="emailSettings.smtpUsername"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
              <input 
                type="password" 
                v-model="emailSettings.smtpPassword"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">From Email</label>
              <input 
                type="email" 
                v-model="emailSettings.fromEmail"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">From Name</label>
              <input 
                type="text" 
                v-model="emailSettings.fromName"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">Email Templates</h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Welcome Email Subject</label>
              <input 
                type="text" 
                v-model="emailSettings.welcomeSubject"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password Reset Subject</label>
              <input 
                type="text" 
                v-model="emailSettings.resetSubject"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <div class="flex space-x-3">
            <button class="btn-primary">Test Email Configuration</button>
            <button class="btn-secondary">Send Test Email</button>
          </div>
        </div>
      </div>

      <!-- Backup Settings -->
      <div v-if="activeTab === 'backup'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Backup Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select 
                v-model="backupSettings.frequency"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Backup Time</label>
              <input 
                type="time" 
                v-model="backupSettings.backupTime"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
              <input 
                type="number" 
                v-model="backupSettings.retentionDays"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
              <select 
                v-model="backupSettings.storageLocation"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="local">Local Storage</option>
                <option value="s3">Amazon S3</option>
                <option value="gcs">Google Cloud Storage</option>
              </select>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">Backup Options</h4>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="backupSettings.includeDatabase" class="rounded">
              <span class="text-sm text-gray-700">Include database in backup</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="backupSettings.includeFiles" class="rounded">
              <span class="text-sm text-gray-700">Include uploaded files in backup</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="backupSettings.compressBackup" class="rounded">
              <span class="text-sm text-gray-700">Compress backup files</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="backupSettings.encryptBackup" class="rounded">
              <span class="text-sm text-gray-700">Encrypt backup files</span>
            </label>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">Recent Backups</h4>
          
          <div class="space-y-3">
            <div 
              v-for="backup in recentBackups" 
              :key="backup.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ backup.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(backup.date) }} • {{ backup.size }}</p>
              </div>
              <div class="flex space-x-2">
                <button class="text-primary-600 hover:text-primary-900 text-sm">Download</button>
                <button class="text-red-600 hover:text-red-900 text-sm">Delete</button>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <button class="btn-primary">Create Backup Now</button>
          </div>
        </div>
      </div>

      <!-- System Settings -->
      <div v-if="activeTab === 'system'" class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
              <select 
                v-model="systemSettings.logLevel"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cache Duration (minutes)</label>
              <input 
                type="number" 
                v-model="systemSettings.cacheDuration"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size (MB)</label>
              <input 
                type="number" 
                v-model="systemSettings.maxFileSize"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Database Connection Pool Size</label>
              <input 
                type="number" 
                v-model="systemSettings.dbPoolSize"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">System Maintenance</h4>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="systemSettings.maintenanceMode" class="rounded">
              <span class="text-sm text-gray-700">Enable maintenance mode</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="systemSettings.debugMode" class="rounded">
              <span class="text-sm text-gray-700">Enable debug mode</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="systemSettings.autoUpdates" class="rounded">
              <span class="text-sm text-gray-700">Enable automatic updates</span>
            </label>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="font-medium text-gray-900 mb-4">System Actions</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="btn-secondary">Clear Application Cache</button>
            <button class="btn-secondary">Rebuild Search Index</button>
            <button class="btn-secondary">Optimize Database</button>
            <button class="btn-secondary">Generate System Report</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const activeTab = ref('general')

const tabs = [
  { id: 'general', name: 'General' },
  { id: 'security', name: 'Security' },
  { id: 'email', name: 'Email' },
  { id: 'backup', name: 'Backup' },
  { id: 'system', name: 'System' }
]

const generalSettings = reactive({
  platformName: 'HarvestSun',
  platformUrl: 'https://harvestsun.com',
  defaultLanguage: 'id',
  defaultTimezone: 'Asia/Jakarta',
  description: 'Digital agriculture management platform for modern farming operations.',
  enableRegistration: true,
  enableNotifications: true,
  enableWeatherIntegration: true,
  enableMobileApp: true
})

const securitySettings = reactive({
  sessionTimeout: 120,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  lockoutDuration: 30,
  requireTwoFactor: false,
  enablePasswordComplexity: true,
  enableAuditLog: true,
  enableIpWhitelist: false,
  apiRateLimit: 100,
  enableApiKeyAuth: true
})

const emailSettings = reactive({
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: 'noreply@harvestsun.com',
  smtpPassword: '',
  fromEmail: 'noreply@harvestsun.com',
  fromName: 'HarvestSun Platform',
  welcomeSubject: 'Welcome to HarvestSun!',
  resetSubject: 'Reset Your Password'
})

const backupSettings = reactive({
  frequency: 'daily',
  backupTime: '02:00',
  retentionDays: 30,
  storageLocation: 'local',
  includeDatabase: true,
  includeFiles: true,
  compressBackup: true,
  encryptBackup: false
})

const systemSettings = reactive({
  logLevel: 'info',
  cacheDuration: 60,
  maxFileSize: 10,
  dbPoolSize: 20,
  maintenanceMode: false,
  debugMode: false,
  autoUpdates: false
})

const recentBackups = ref([
  {
    id: 1,
    name: 'backup_2024_01_15_02_00.sql.gz',
    date: new Date().toISOString(),
    size: '45.2 MB'
  },
  {
    id: 2,
    name: 'backup_2024_01_14_02_00.sql.gz',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '44.8 MB'
  },
  {
    id: 3,
    name: 'backup_2024_01_13_02_00.sql.gz',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: '44.1 MB'
  }
])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>