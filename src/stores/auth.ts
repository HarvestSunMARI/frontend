import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'
import axios from '../plugins/axios'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('/auth/login', credentials)
      const { token: newToken, user: userData } = response.data

      // Save token and user
      token.value = newToken
      user.value = userData
      isAuthenticated.value = true
      localStorage.setItem('token', newToken)

      // Return redirect path based on role
      switch (userData.role) {
        case 'admin':
          return '/manajemen-pengguna'
        case 'konsultan_tani':
          return '/konsultan-tani'
        case 'penyuluh':
          return '/dashboard'
        default:
          return '/dashboard'
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat login')
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: 'admin' | 'konsultan_tani' | 'penyuluh'
  }) => {
    try {
      const response = await axios.post('/auth/register', userData)
      const { token: newToken, user: registeredUser } = response.data

      // Save token and user
      token.value = newToken
      user.value = registeredUser
      isAuthenticated.value = true
      localStorage.setItem('token', newToken)

      // Return redirect path based on role
      switch (registeredUser.role) {
        case 'admin':
          return '/manajemen-pengguna'
        case 'konsultan_tani':
          return '/konsultan-tani'
        case 'penyuluh':
          return '/dashboard'
        default:
          return '/dashboard'
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat registrasi')
    }
  }

  const logout = async () => {
    try {
      await axios.post('/auth/destroy')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear auth data
      token.value = null
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
      // Redirect to login page
      window.location.href = '/auth/login'
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get('/auth/user')
      user.value = response.data
      isAuthenticated.value = true
      return true
    } catch (error) {
      // If token is invalid, clear auth data
      token.value = null
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
})