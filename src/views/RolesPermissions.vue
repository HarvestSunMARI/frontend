<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Roles & Permissions</h2>
      <button class="btn-primary" @click="showCreateRoleModal = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Role
      </button>
    </div>

    <!-- Role Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Total Roles"
        :value="roleStats.total"
        :icon="ShieldCheckIcon"
        color="primary"
      />
      <StatCard
        label="Custom Roles"
        :value="roleStats.custom"
        :icon="CogIcon"
        color="earth"
      />
      <StatCard
        label="Active Users"
        :value="roleStats.activeUsers"
        :icon="UsersIcon"
        color="yellow"
      />
    </div>

    <!-- Roles Management -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Roles List -->
      <div class="lg:col-span-2">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">System Roles</h3>
          
          <div class="space-y-4">
            <div 
              v-for="role in roles" 
              :key="role.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              :class="{ 'ring-2 ring-primary-500': selectedRole?.id === role.id }"
              @click="selectRole(role)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="roleColorClass(role.name)"
                  >
                    <component :is="roleIcon(role.name)" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ role.displayName }}</h4>
                    <p class="text-sm text-gray-500">{{ role.userCount }} users</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click.stop="editRole(role)"
                    class="text-primary-600 hover:text-primary-900 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    v-if="role.name !== 'admin'"
                    @click.stop="deleteRole(role.id)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-3">{{ role.description }}</p>
              
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="permission in role.permissions.slice(0, 3)" 
                  :key="permission"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ permission.replace('_', ' ') }}
                </span>
                <span 
                  v-if="role.permissions.length > 3"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  +{{ role.permissions.length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permission Details -->
      <div class="space-y-6">
        <!-- Selected Role Permissions -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ selectedRole ? selectedRole.displayName + ' Permissions' : 'Select a Role' }}
          </h3>
          
          <div v-if="selectedRole" class="space-y-4">
            <div 
              v-for="category in permissionCategories" 
              :key="category.name"
              class="border border-gray-200 rounded-lg p-4"
            >
              <h4 class="font-medium text-gray-900 mb-3">{{ category.displayName }}</h4>
              
              <div class="space-y-2">
                <label 
                  v-for="permission in category.permissions" 
                  :key="permission.name"
                  class="flex items-center space-x-3"
                >
                  <input 
                    type="checkbox" 
                    :checked="selectedRole.permissions.includes(permission.name)"
                    @change="togglePermission(permission.name)"
                    class="rounded text-primary-600"
                  >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ permission.displayName }}</p>
                    <p class="text-xs text-gray-500">{{ permission.description }}</p>
                  </div>
                </label>
              </div>
            </div>
            
            <button class="w-full btn-primary">Save Changes</button>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <ShieldCheckIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Select a role to view permissions</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div class="space-y-2">
            <button class="w-full btn-primary text-sm">Duplicate Role</button>
            <button class="w-full btn-secondary text-sm">Export Permissions</button>
            <button class="w-full btn-secondary text-sm">Import Permissions</button>
            <button class="w-full btn-secondary text-sm">Reset to Default</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permission Matrix -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Permission Matrix</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th 
                v-for="role in roles" 
                :key="role.id"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ role.displayName }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="permission in allPermissions" 
              :key="permission.name"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ permission.displayName }}</div>
                  <div class="text-sm text-gray-500">{{ permission.description }}</div>
                </div>
              </td>
              <td 
                v-for="role in roles" 
                :key="role.id"
                class="px-6 py-4 whitespace-nowrap text-center"
              >
                <span 
                  v-if="role.permissions.includes(permission.name)"
                  class="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full"
                >
                  <CheckIcon class="w-4 h-4 text-green-600" />
                </span>
                <span 
                  v-else
                  class="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full"
                >
                  <XMarkIcon class="w-4 h-4 text-gray-400" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Role Modal -->
    <div v-if="showCreateRoleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Role</h3>
        
        <form @submit.prevent="createRole" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
            <input 
              type="text" 
              v-model="newRole.name"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              type="text" 
              v-model="newRole.displayName"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="newRole.description"
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div class="flex space-x-3">
            <button type="submit" class="flex-1 btn-primary">Create Role</button>
            <button 
              type="button" 
              @click="showCreateRoleModal = false"
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import {
  PlusIcon,
  ShieldCheckIcon,
  CogIcon,
  UsersIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

interface Permission {
  name: string
  displayName: string
  description: string
}

interface PermissionCategory {
  name: string
  displayName: string
  permissions: Permission[]
}

interface Role {
  id: number
  name: string
  displayName: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
}

const showCreateRoleModal = ref(false)
const selectedRole = ref<Role | null>(null)

const newRole = reactive({
  name: '',
  displayName: '',
  description: ''
})

const roleStats = reactive({
  total: 5,
  custom: 2,
  activeUsers: 127
})

const roles = ref<Role[]>([
  {
    id: 1,
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      'user_create', 'user_read', 'user_update', 'user_delete',
      'role_create', 'role_read', 'role_update', 'role_delete',
      'field_create', 'field_read', 'field_update', 'field_delete',
      'report_create', 'report_read', 'report_update', 'report_delete',
      'task_create', 'task_read', 'task_update', 'task_delete',
      'system_settings', 'system_logs', 'system_backup'
    ],
    userCount: 6,
    isSystem: true
  },
  {
    id: 2,
    name: 'penyuluh',
    displayName: 'Penyuluh',
    description: 'Regional supervisor with consultant management access',
    permissions: [
      'user_read', 'user_update',
      'field_read', 'field_update',
      'report_read', 'report_create',
      'task_create', 'task_read', 'task_update',
      'consultant_manage'
    ],
    userCount: 32,
    isSystem: true
  },
  {
    id: 3,
    name: 'konsultan_tani',
    displayName: 'Konsultan Tani',
    description: 'Field consultant with limited field and task access',
    permissions: [
      'field_read', 'field_update',
      'report_create', 'report_read',
      'task_read', 'task_update',
      'profile_update'
    ],
    userCount: 89,
    isSystem: true
  },
  {
    id: 4,
    name: 'field_manager',
    displayName: 'Field Manager',
    description: 'Custom role for field management operations',
    permissions: [
      'field_create', 'field_read', 'field_update',
      'report_read', 'report_create',
      'task_create', 'task_read', 'task_update'
    ],
    userCount: 0,
    isSystem: false
  },
  {
    id: 5,
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to system data',
    permissions: [
      'field_read',
      'report_read',
      'task_read'
    ],
    userCount: 0,
    isSystem: false
  }
])

const permissionCategories = ref<PermissionCategory[]>([
  {
    name: 'user_management',
    displayName: 'User Management',
    permissions: [
      { name: 'user_create', displayName: 'Create Users', description: 'Add new users to the system' },
      { name: 'user_read', displayName: 'View Users', description: 'View user profiles and information' },
      { name: 'user_update', displayName: 'Update Users', description: 'Edit user profiles and settings' },
      { name: 'user_delete', displayName: 'Delete Users', description: 'Remove users from the system' }
    ]
  },
  {
    name: 'role_management',
    displayName: 'Role Management',
    permissions: [
      { name: 'role_create', displayName: 'Create Roles', description: 'Create new roles and permissions' },
      { name: 'role_read', displayName: 'View Roles', description: 'View roles and their permissions' },
      { name: 'role_update', displayName: 'Update Roles', description: 'Modify role permissions' },
      { name: 'role_delete', displayName: 'Delete Roles', description: 'Remove roles from the system' }
    ]
  },
  {
    name: 'field_management',
    displayName: 'Field Management',
    permissions: [
      { name: 'field_create', displayName: 'Create Fields', description: 'Add new fields to the system' },
      { name: 'field_read', displayName: 'View Fields', description: 'View field information and maps' },
      { name: 'field_update', displayName: 'Update Fields', description: 'Edit field data and status' },
      { name: 'field_delete', displayName: 'Delete Fields', description: 'Remove fields from the system' }
    ]
  },
  {
    name: 'report_management',
    displayName: 'Report Management',
    permissions: [
      { name: 'report_create', displayName: 'Create Reports', description: 'Generate new reports' },
      { name: 'report_read', displayName: 'View Reports', description: 'Access and view reports' },
      { name: 'report_update', displayName: 'Update Reports', description: 'Edit existing reports' },
      { name: 'report_delete', displayName: 'Delete Reports', description: 'Remove reports from the system' }
    ]
  },
  {
    name: 'task_management',
    displayName: 'Task Management',
    permissions: [
      { name: 'task_create', displayName: 'Create Tasks', description: 'Assign new tasks to users' },
      { name: 'task_read', displayName: 'View Tasks', description: 'View task lists and details' },
      { name: 'task_update', displayName: 'Update Tasks', description: 'Modify task status and details' },
      { name: 'task_delete', displayName: 'Delete Tasks', description: 'Remove tasks from the system' }
    ]
  },
  {
    name: 'system_management',
    displayName: 'System Management',
    permissions: [
      { name: 'system_settings', displayName: 'System Settings', description: 'Access system configuration' },
      { name: 'system_logs', displayName: 'System Logs', description: 'View system activity logs' },
      { name: 'system_backup', displayName: 'System Backup', description: 'Perform system backups' }
    ]
  }
])

const allPermissions = computed(() => {
  return permissionCategories.value.flatMap(category => category.permissions)
})

const selectRole = (role: Role) => {
  selectedRole.value = role
}

const roleIcon = (roleName: string) => {
  const icons = {
    admin: ShieldCheckIcon,
    penyuluh: AcademicCapIcon,
    konsultan_tani: UserIcon,
    field_manager: CogIcon,
    viewer: UsersIcon
  }
  return icons[roleName] || CogIcon
}

const roleColorClass = (roleName: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-600',
    penyuluh: 'bg-yellow-100 text-yellow-600',
    konsultan_tani: 'bg-primary-100 text-primary-600',
    field_manager: 'bg-blue-100 text-blue-600',
    viewer: 'bg-gray-100 text-gray-600'
  }
  return classes[roleName] || 'bg-gray-100 text-gray-600'
}

const togglePermission = (permissionName: string) => {
  if (!selectedRole.value) return
  
  const index = selectedRole.value.permissions.indexOf(permissionName)
  if (index > -1) {
    selectedRole.value.permissions.splice(index, 1)
  } else {
    selectedRole.value.permissions.push(permissionName)
  }
}

const createRole = () => {
  const role: Role = {
    id: roles.value.length + 1,
    name: newRole.name.toLowerCase().replace(/\s+/g, '_'),
    displayName: newRole.displayName,
    description: newRole.description,
    permissions: [],
    userCount: 0,
    isSystem: false
  }

  roles.value.push(role)
  
  // Reset form
  newRole.name = ''
  newRole.displayName = ''
  newRole.description = ''
  
  showCreateRoleModal.value = false
}

const editRole = (role: Role) => {
  console.log('Editing role:', role.name)
  // Add logic to edit role
}

const deleteRole = (roleId: number) => {
  const index = roles.value.findIndex(r => r.id === roleId)
  if (index > -1) {
    roles.value.splice(index, 1)
    if (selectedRole.value?.id === roleId) {
      selectedRole.value = null
    }
  }
}
</script>