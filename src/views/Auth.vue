<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center mb-4">
        <div class="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-3xl">HS</span>
        </div>
      </div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {{ isLogin ? 'Masuk ke HarvestSun' : 'Daftar di HarvestSun' }}
      </h2>
      <p class="text-center text-base text-gray-500 mb-6">
        Platform pertanian digital untuk Indonesia
      </p>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>
        
        <!-- Form Login -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-primary w-full"
              placeholder="Alamat email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-primary w-full"
              placeholder="Password"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember_me"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember_me" class="ml-2 block text-sm text-gray-900">
                Ingat saya
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-150">
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="btn-primary w-full py-3 text-lg font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-150"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <!-- Form Register -->
        <form v-else @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-primary w-full"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-primary w-full"
              placeholder="Alamat email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-primary w-full"
              placeholder="Password"
            />
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="input-primary w-full"
              placeholder="Ulangi password"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
              Daftar Sebagai
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="select-primary w-full"
            >
              <option value="konsultan_tani">Konsultan Tani</option>
              <option value="penyuluh">Penyuluh</option>
            </select>
          </div>

          <div>
            <button 
              type="submit" 
              class="btn-primary w-full py-3 text-lg font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-150"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>

        <div class="mt-8">
          <div class="relative mb-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-white text-gray-500">
                Atau {{ isLogin ? 'masuk' : 'daftar' }} dengan
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="btn-outline w-full flex items-center justify-center py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              class="btn-outline w-full flex items-center justify-center py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
            <button 
              type="button"
              @click="toggleAuthMode" 
              class="font-medium text-primary-600 hover:text-primary-500 cursor-pointer ml-1 transition-colors duration-150"
            >
              {{ isLogin ? 'Daftar di sini' : 'Masuk di sini' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Set initial state based on route
const isLogin = ref(route.path === '/auth/login')
const isLoading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'konsultan_tani' as 'konsultan_tani' | 'penyuluh',
  remember: false
})

// Reset form when switching between login and register
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'konsultan_tani',
    remember: false
  }
  error.value = ''
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const redirectPath = await authStore.login({
      email: form.value.email,
      password: form.value.password
    })

    router.push(redirectPath)
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    error.value = ''

    // Validate password confirmation
    if (form.value.password !== form.value.password_confirmation) {
      throw new Error('Password dan konfirmasi password tidak cocok')
    }

    const redirectPath = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      role: form.value.role
    })

    router.push(redirectPath)
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Watch for route changes to update isLogin state
const updateAuthMode = () => {
  isLogin.value = route.path === '/auth/login'
  resetForm()
}

// Update auth mode when route changes
onMounted(() => {
  updateAuthMode()
})

// Handle mode switch
const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
  router.push(isLogin.value ? '/auth/login' : '/auth/register')
}
</script>

<style scoped>
.input-primary {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full;
}
.select-primary {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full;
}
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-150;
}
.btn-outline {
  @apply border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-150;
}
</style> 