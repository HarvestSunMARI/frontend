import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../plugins/axios'
import type { User } from '../types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  // Fetch all users
  const fetchUsers = async () => {
    try {
      loading.value = true
      const response = await axios.get('/users')
      users.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data pengguna'
    } finally {
      loading.value = false
    }
  }

  // Create new user
  const createUser = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: 'admin' | 'konsultan_tani' | 'penyuluh'
  }) => {
    try {
      loading.value = true
      const response = await axios.post('/auth/register', userData)
      users.value.push(response.data.user)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal membuat pengguna baru'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user
  const updateUser = async (id: number, userData: {
    name: string
    email: string
    role: 'admin' | 'konsultan_tani' | 'penyuluh'
  }) => {
    try {
      loading.value = true
      const response = await axios.put(`/users/${id}`, userData)
      const index = users.value.findIndex(u => u.id === id)
      if (index > -1) {
        users.value[index] = response.data.user
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengupdate pengguna'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      loading.value = true
      await axios.delete(`/users/${id}`)
      const index = users.value.findIndex(u => u.id === id)
      if (index > -1) {
        users.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal menghapus pengguna'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get user stats
  const getUserStats = () => {
    return {
      total: users.value.length,
      konsultanTani: users.value.filter(u => u.role === 'konsultan_tani').length,
      penyuluh: users.value.filter(u => u.role === 'penyuluh').length,
      admin: users.value.filter(u => u.role === 'admin').length
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
  }
})