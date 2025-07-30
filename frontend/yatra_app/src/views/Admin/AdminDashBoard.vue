<template>
  <div class="admin-dashboard">
    <Sidebar
      :sidebarCollapsed="sidebarCollapsed"
      :activeTab="activeTab"
      :totalUsers="totalUsers"
      :adminUser="adminUser"
      @toggleSidebar="toggleSidebar"
      @changeTab="setActiveTab"
      @logout="logout"
    />

    <main class="main-content">
      <Header
        :activeTab="activeTab"
        :notifications="notifications"
        :currentTime="currentTime"
        :currentDate="currentDate"
        :getPageTitle="getPageTitle"
        :getPageSubtitle="getPageSubtitle"
        @toggleNotifications="toggleNotifications"
      />

      <div class="content-area">
        <!-- Dashboard Tab -->
        <!-- <div v-if="activeTab === 'dashboard'" class="dashboard-tab">
          <div class="activity-section">
            <div class="section-header">
              <h3>Recent Activity</h3>
              <button class="view-all-btn">View All</button>
            </div>
            <div class="activity-list">
              <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                <div class="activity-icon" :class="activity.type">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p>{{ activity.description }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
                <div class="activity-status" :class="activity.status">
                  {{ activity.statusText }}
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="users-tab">
          <div class="users-header">
            <div class="users-search">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input type="text" v-model="userSearchQuery" placeholder="Search users...">
              </div>
            </div>
          </div>

          <div class="users-table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar" >
                          <img class="profile"
                            :src="user.profilePicture ? getBackendImageUrl(user.profilePicture) : defaultAvatar"
                            alt="">
                      </div>
                      <div class="user-details">
                        <h5>{{ user.name }}</h5>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>
                    <div class="action-buttons">
                      <!-- <button class="action-btn small" @click="editUser(user)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button> -->
                      <button class="action-btn small danger" @click="deleteUser(user._id)" title="Delete">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Routes Tab -->
        <TripsTab v-if="activeTab === 'routes'"></TripsTab>

        <AdminRoutes v-if="activeTab === 'trip'"></AdminRoutes>
      </div>
    </main>

    <!-- Notifications Panel -->
    <!-- <div v-if="showNotifications" class="notifications-panel">
      <div class="notifications-header">
        <h3>
          <i class="bi bi-bell-fill"></i>
          Notifications
        </h3>
        <button @click="closeNotifications" class="close-btn">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="notifications-list">
        <div class="notification-item" v-for="notification in notifications" :key="notification.id">
          <div class="notification-icon" :class="notification.type">
            <i :class="notification.icon"></i>
          </div>
          <div class="notification-content">
            <h5>{{ notification.title }}</h5>
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
          <button class="notification-close" @click="removeNotification(notification.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
      <div class="notifications-footer">
        <button class="clear-all-btn" @click="clearAllNotifications">
          <i class="bi bi-trash"></i>
          Clear All
        </button>
      </div>
    </div> -->

    <!-- Notification Overlay -->
    <!-- <div v-if="showNotifications" class="notification-overlay" @click="closeNotifications"></div> -->

    <!-- Loading Overlay -->
    <!-- <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <p>Loading...</p>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import Header from '@/components/admin/Header.vue'
import TripsTab from '@/components/admin/TripsTab.vue'
import './Admin.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { adminApiClient, userApiClient } from '@/services/axios';
import { useAuthStore } from '@/stores/Auth';
import { useRouter } from 'vue-router';
import AdminRoutes from './Routes/AdminRoutes.vue'
import { getBackendImageUrl } from '@/utils/imageHelpers'

const router = useRouter();
const authStore = useAuthStore();

const sidebarCollapsed = ref(true)
const activeTab = ref('users')
const isLoading = ref(false)
const showNotifications = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const userSearchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const adminUser = reactive({
  email: '',
  role: '',
})

const users = ref([])
const defaultAvatar = "https://avatar.iran.liara.run/public/boy"

const fetchAdmin = async() => {
  try{
    const response = await adminApiClient.get('/profile');
    const data = response.data
    adminUser.email = data.email
    adminUser.role = data.role
  }catch(error){
    console.log('Failed to get admin profile: ',error)
  }
}

const fetchUsers = async () => {
  try{
    isLoading.value = true;
    const response = await adminApiClient.get('/users')
    users.value = response.data.users || []
  }catch(error){
    console.error('Failed to fetch user: ',error)
    users.value = []
  } finally{
    isLoading.value = false
  }
}

const notifications = ref([
  {
    id: 1,
    type: 'info',
    icon: 'bi bi-info-circle',
    title: 'System Update',
    message: 'New features have been deployed successfully',
    time: '5 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    icon: 'bi bi-exclamation-triangle',
    title: 'High Traffic Alert',
    message: 'Unusual traffic detected on Ring Road route',
    time: '20 minutes ago'
  },
  {
    id: 3,
    type: 'success',
    icon: 'bi bi-check-circle',
    title: 'Backup Completed',
    message: 'Daily backup has been completed successfully',
    time: '1 hour ago'
  }
])

const totalUsers = computed(() => users.value.length)

const filteredUsers = computed(() => {
  let filtered = users.value

  if (userSearchQuery.value) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

// Pagination of users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const getPageTitle = () => {
  const titles = {
    analytics: 'Analytics',
    users: 'User Management',
    routes: 'Trip Management',
    trip: 'Route Management',
    settings: 'Settings',
    reports: 'Reports'
  }
  return titles[activeTab.value] || 'User Management'
}

const getPageSubtitle = () => {
  const subtitles = {
    analytics: 'Detailed insights and metrics',
    users: 'Manage user accounts and permissions',
    routes: 'Configure and monitor transport trips',
    trip: 'Manage routes',
    settings: 'Application configuration',
    reports: 'Generate and view reports'
  }
  return subtitles[activeTab.value] || ''
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  notifications.value = []
  showNotifications.value = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US')
}

const editUser = (user) => {
  console.log('Edit user:', user)
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    await adminApiClient.delete(`/users/${userId}`);
    users.value = users.value.filter(user => user._id !== userId);
    console.log('Deleted user:', userId);
    alert('User deleted successfully.');
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user.');
  }
};

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.token = null;
    authStore.user = null;
    localStorage.removeItem('token');
    router.push('/');
  }
}

const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  currentDate.value = now.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(() => {
  updateDateTime()
  fetchUsers()
  fetchAdmin()
  const interval = setInterval(updateDateTime, 1000)
  onUnmounted(() => clearInterval(interval))
})
</script>