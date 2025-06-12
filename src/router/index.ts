import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Auth from '../views/Auth.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/auth/login'
    },
    {
      path: '/auth',
      component: Auth,
      meta: { requiresAuth: false },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Auth
        },
        {
          path: 'register',
          name: 'Register',
          component: Auth
        }
      ]
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue')
        }
      ]
    },
    {
      path: '/agenda',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Agenda',
          component: () => import('../views/Agenda.vue')
        }
      ]
    },
    {
      path: '/checklist',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Checklist',
          component: () => import('../views/Checklist.vue')
        }
      ]
    },
    {
      path: '/laporan',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Laporan',
          component: () => import('../views/Laporan.vue')
        }
      ]
    },
    {
      path: '/tugas',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Tugas',
          component: () => import('../views/Tugas.vue')
        }
      ]
    },
    {
      path: '/peta-lahan',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'PetaLahan',
          component: () => import('../views/PetaLahan.vue')
        }
      ]
    },
    {
      path: '/pengaturan',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Pengaturan',
          component: () => import('../views/Pengaturan.vue')
        }
      ]
    },
    // Konsultan Tani routes
    {
      path: '/konsultan-tani',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['konsultan_tani'] },
      children: [
        {
          path: '',
          name: 'KonsultanTani',
          component: () => import('../views/KonsultanTani.vue')
        }
      ]
    },
    {
      path: '/ai-assistant',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['konsultan_tani'] },
      children: [
        {
          path: '',
          name: 'AIAssistant',
          component: () => import('../views/AIAssistant.vue')
        }
      ]
    },
    // Penyuluh routes
    {
      path: '/peta-wilayah',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['penyuluh'] },
      children: [
        {
          path: '',
          name: 'PetaWilayah',
          component: () => import('../views/PetaWilayah.vue')
        }
      ]
    },
    // Admin routes
    {
      path: '/manajemen-pengguna',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'ManajemenPengguna',
          component: () => import('../views/ManajemenPengguna.vue')
        }
      ]
    },
    {
      path: '/roles-permissions',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'RolesPermissions',
          component: () => import('../views/RolesPermissions.vue')
        }
      ]
    },
    {
      path: '/log-aktivitas',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'LogAktivitas',
          component: () => import('../views/LogAktivitas.vue')
        }
      ]
    },
    {
      path: '/data-overview',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'DataOverview',
          component: () => import('../views/DataOverview.vue')
        }
      ]
    },
    {
      path: '/pengaturan-platform',
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'PengaturanPlatform',
          component: () => import('../views/PengaturanPlatform.vue')
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRoles = to.matched.some(record => record.meta.roles)
    ? to.matched.find(record => record.meta.roles)?.meta.roles as string[]
    : null

  // Check authentication status
  const isAuthenticated = await authStore.checkAuth()

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ 
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  } else if (!requiresAuth && isAuthenticated) {
    // Redirect based on user role if already authenticated
    const userRole = authStore.user?.role || 'konsultan_tani'
    switch (userRole) {
      case 'admin':
        next('/manajemen-pengguna')
        break
      case 'konsultan_tani':
        next('/konsultan-tani')
        break
      case 'penyuluh':
        next('/dashboard')
        break
      default:
        next('/dashboard')
    }
  } else if (requiredRoles && !requiredRoles.includes(authStore.user?.role)) {
    // Redirect based on user role if they don't have required role
    const userRole = authStore.user?.role || 'konsultan_tani'
    switch (userRole) {
      case 'admin':
        next('/manajemen-pengguna')
        break
      case 'konsultan_tani':
        next('/konsultan-tani')
        break
      case 'penyuluh':
        next('/dashboard')
        break
      default:
        next('/dashboard')
    }
  } else {
    next()
  }
})

export default router