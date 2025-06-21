<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <i class="bi bi-compass"></i>
          <span v-if="!sidebarCollapsed">Yatra Admin</span>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4 v-if="!sidebarCollapsed">Overview</h4>
          <ul>
            <li>
              <a href="#" @click="setActiveTab('dashboard')" :class="{ 'active': activeTab === 'dashboard' }">
                <i class="bi bi-speedometer2"></i>
                <span v-if="!sidebarCollapsed">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" @click="setActiveTab('analytics')" :class="{ 'active': activeTab === 'analytics' }">
                <i class="bi bi-graph-up"></i>
                <span v-if="!sidebarCollapsed">Analytics</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h4 v-if="!sidebarCollapsed">Management</h4>
          <ul>
            <li>
              <a href="#" @click="setActiveTab('users')" :class="{ 'active': activeTab === 'users' }">
                <i class="bi bi-people"></i>
                <span v-if="!sidebarCollapsed">Users</span>
                <span v-if="!sidebarCollapsed" class="badge">{{ totalUsers }}</span>
              </a>
            </li>
            <li>
              <a href="#" @click="setActiveTab('routes')" :class="{ 'active': activeTab === 'routes' }">
                <i class="bi bi-map"></i>
                <span v-if="!sidebarCollapsed">Routes</span>
              </a>
            </li>
            <li>
              <a href="#" @click="setActiveTab('feedback')" :class="{ 'active': activeTab === 'feedback' }">
                <i class="bi bi-chat-square-text"></i>
                <span v-if="!sidebarCollapsed">Feedback</span>
                <span v-if="!sidebarCollapsed && unreadFeedback > 0" class="badge alert">{{ unreadFeedback }}</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h4 v-if="!sidebarCollapsed">System</h4>
          <ul>
            <li>
              <a href="#" @click="setActiveTab('settings')" :class="{ 'active': activeTab === 'settings' }">
                <i class="bi bi-gear"></i>
                <span v-if="!sidebarCollapsed">Settings</span>
              </a>
            </li>
            <li>
              <a href="#" @click="setActiveTab('reports')" :class="{ 'active': activeTab === 'reports' }">
                <i class="bi bi-file-earmark-text"></i>
                <span v-if="!sidebarCollapsed">Reports</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="profile-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div v-if="!sidebarCollapsed" class="profile-info">
            <h5>{{ adminUser.name }}</h5>
            <span>{{ adminUser.role }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="logout" :title="sidebarCollapsed ? 'Logout' : ''">
          <i class="bi bi-box-arrow-right"></i>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="main-header">
        <div class="header-left">
          <h1>{{ getPageTitle() }}</h1>
          <p class="header-subtitle">{{ getPageSubtitle() }}</p>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <button class="action-btn" @click="refreshData">
              <i class="bi bi-arrow-clockwise" :class="{ 'spinning': isRefreshing }"></i>
            </button>
            <button class="action-btn" @click="toggleNotifications">
              <i class="bi bi-bell"></i>
              <span v-if="notifications.length > 0" class="notification-count">{{ notifications.length }}</span>
            </button>
            <div class="date-time">
              <span class="time">{{ currentTime }}</span>
              <span class="date">{{ currentDate }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="content-area">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="dashboard-tab">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card" v-for="stat in dashboardStats" :key="stat.id">
              <div class="stat-icon" :class="stat.iconClass">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-content">
                <h3>{{ stat.value }}</h3>
                <p>{{ stat.label }}</p>
                <div class="stat-change" :class="stat.changeType">
                  <i :class="stat.changeIcon"></i>
                  <span>{{ stat.change }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="charts-row">
            <div class="chart-card">
              <div class="card-header">
                <h3>User Growth</h3>
                <div class="chart-controls">
                  <select v-model="userGrowthPeriod" @change="updateUserGrowthChart">
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div class="bar" v-for="(value, index) in userGrowthData" :key="index" 
                         :style="{ height: `${(value / Math.max(...userGrowthData)) * 100}%` }">
                    </div>
                  </div>
                  <div class="chart-labels">
                    <span v-for="label in userGrowthLabels" :key="label">{{ label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <div class="card-header">
                <h3>Transport Usage</h3>
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color bus"></div>
                    <span>Bus Routes</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color micro"></div>
                    <span>Micro Bus</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color walking"></div>
                    <span>Walking</span>
                  </div>
                </div>
              </div>
              <div class="chart-container">
                <div class="donut-chart">
                  <div class="donut-center">
                    <h4>{{ totalRoutes }}</h4>
                    <span>Total Routes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
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
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="analytics-tab">
          <div class="analytics-filters">
            <div class="filter-group">
              <label>Date Range:</label>
              <select v-model="analyticsDateRange">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Metric:</label>
              <select v-model="analyticsMetric">
                <option value="users">Active Users</option>
                <option value="routes">Route Usage</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>

          <div class="analytics-grid">
            <div class="analytics-card">
              <h3>Performance Metrics</h3>
              <div class="metrics-list">
                <div class="metric-item" v-for="metric in performanceMetrics" :key="metric.name">
                  <span class="metric-name">{{ metric.name }}</span>
                  <div class="metric-bar">
                    <div class="metric-fill" :style="{ width: `${metric.percentage}%` }"></div>
                  </div>
                  <span class="metric-value">{{ metric.value }}</span>
                </div>
              </div>
            </div>

            <div class="analytics-card">
              <h3>Geographic Distribution</h3>
              <div class="geo-stats">
                <div class="geo-item" v-for="city in topCities" :key="city.name">
                  <div class="city-info">
                    <h4>{{ city.name }}</h4>
                    <span>{{ city.users }} users</span>
                  </div>
                  <div class="city-percentage">{{ city.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="users-tab">
          <div class="users-header">
            <div class="users-search">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input type="text" v-model="userSearchQuery" placeholder="Search users...">
              </div>
              <div class="users-filters">
                <select v-model="userStatusFilter">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <button class="add-user-btn" @click="handleAddUSer">
              <i class="bi bi-person-plus"></i>
              Add User
            </button>
          </div>

          <div class="users-table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Routes Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">
                        <i class="bi bi-person-circle"></i>
                      </div>
                      <div class="user-details">
                        <h5>{{ user.name }}</h5>
                        <span>{{ user.location }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatDate(user.joinDate) }}</td>
                  <td>
                    <span class="status-badge" :class="user.status">{{ user.status }}</span>
                  </td>
                  <td>{{ user.routesUsed }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn small" @click="editUser(user)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="action-btn small" @click="viewUser(user)" title="View">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="action-btn small danger" @click="deleteUser(user)" title="Delete">
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
        <div v-if="activeTab === 'routes'" class="routes-tab" >
          <div class="routes-header" @click="handleAddRoute">
            <h3>Route Management</h3>
            <button class="add-route-btn">
              <i class="bi bi-plus-circle"></i>
              Add Route
            </button>
          </div>

          <div class="routes-grid">
            <div class="route-card" v-for="route in routes" :key="route.id">
              <div class="route-header">
                <div class="route-type" :class="route.type">
                  <i :class="route.icon"></i>
                  <span>{{ route.type }}</span>
                </div>
                <div class="route-status" :class="route.status">
                  {{ route.status }}
                </div>
              </div>
              <div class="route-content">
                <h4>{{ route.name }}</h4>
                <p>{{ route.description }}</p>
                <div class="route-stats">
                  <div class="route-stat">
                    <i class="bi bi-people"></i>
                    <span>{{ route.users }} users</span>
                  </div>
                  <div class="route-stat">
                    <i class="bi bi-clock"></i>
                    <span>{{ route.avgTime }} min</span>
                  </div>
                </div>
              </div>
              <div class="route-actions">
                <button class="route-btn">Edit</button>
                <button class="route-btn secondary">View</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="settings-tab">
          <div class="settings-sections">
            <div class="settings-section">
              <h3>General Settings</h3>
              <div class="settings-form">
                <div class="form-group">
                  <label>App Name</label>
                  <input type="text" v-model="settings.appName">
                </div>
                <div class="form-group">
                  <label>Default Language</label>
                  <select v-model="settings.defaultLanguage">
                    <option value="ne">Nepali</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Maintenance Mode</label>
                  <div class="toggle-switch">
                    <input type="checkbox" v-model="settings.maintenanceMode" id="maintenance">
                    <label for="maintenance"></label>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-section">
              <h3>Notification Settings</h3>
              <div class="settings-form">
                <div class="form-group">
                  <label>Email Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" v-model="settings.emailNotifications" id="email">
                    <label for="email"></label>
                  </div>
                </div>
                <div class="form-group">
                  <label>Push Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" v-model="settings.pushNotifications" id="push">
                    <label for="push"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-actions">
            <button class="save-btn" @click="saveSettings">
              <i class="bi bi-check-circle"></i>
              Save Changes
            </button>
            <button class="reset-btn" @click="resetSettings">
              <i class="bi bi-arrow-clockwise"></i>
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Notifications Panel -->
    <div v-if="showNotifications" class="notifications-panel">
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
    </div>

    <!-- Notification Overlay -->
    <div v-if="showNotifications" class="notification-overlay" @click="closeNotifications"></div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import './Admin.css'

// Reactive state
const sidebarCollapsed = ref(false)
const activeTab = ref('dashboard')
const isLoading = ref(false)
const isRefreshing = ref(false)
const showNotifications = ref(false)
const showAddUserModal = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const userSearchQuery = ref('')
const userStatusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const userGrowthPeriod = ref('30d')
const analyticsDateRange = ref('month')
const analyticsMetric = ref('users')


const router = useRouter();
function handleAddUSer(){
  showAddUserModal.value = true;
  router.push('/addUser')
}
function handleAddRoute(){
  showAddUserModal.value = true;
  router.push('/admin/addRoute')
}



// Admin user data
const adminUser = reactive({
  name: 'Ram Sharma',
  role: 'Super Admin',
  avatar: null
})



// Dashboard stats
const dashboardStats = ref([
  {
    id: 1,
    icon: 'bi bi-people-fill',
    iconClass: 'users',
    label: 'Total Users',
    value: '8,543',
    change: '+15.2%',
    changeType: 'positive',
    changeIcon: 'bi bi-trending-up'
  },
  {
    id: 2,
    icon: 'bi bi-map-fill',
    iconClass: 'routes',
    label: 'Active Routes',
    value: '247',
    change: '+8.7%',
    changeType: 'positive',
    changeIcon: 'bi bi-arrow-up-circle'
  },
  {
    id: 3,
    icon: 'bi bi-clock-fill',
    iconClass: 'time',
    label: 'Avg Response Time',
    value: '1.8s',
    change: '-3.1%',
    changeType: 'positive',
    changeIcon: 'bi bi-arrow-down-circle'
  },
  {
    id: 4,
    icon: 'bi bi-star-fill',
    iconClass: 'rating',
    label: 'User Satisfaction',
    value: '4.6/5',
    change: '+0.4',
    changeType: 'positive',
    changeIcon: 'bi bi-arrow-up-circle-fill'
  }
])

// Chart data
const userGrowthData = ref([35, 42, 38, 51, 45, 57, 63])
const userGrowthLabels = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

// Users data (Nepal-specific)
const users = ref([
  {
    id: 1,
    name: 'Sita Gurung',
    email: 'sita.gurung@email.com',
    location: 'Kathmandu',
    joinDate: '2024-01-15',
    status: 'active',
    routesUsed: 45
  },
  {
    id: 2,
    name: 'Rajesh Shrestha',
    email: 'rajesh.s@email.com',
    location: 'Pokhara',
    joinDate: '2024-02-20',
    status: 'active',
    routesUsed: 32
  },
  {
    id: 3,
    name: 'Maya Tamang',
    email: 'maya.t@email.com',
    location: 'Lalitpur',
    joinDate: '2024-01-08',
    status: 'inactive',
    routesUsed: 18
  },
  {
    id: 4,
    name: 'Bikash Rai',
    email: 'bikash.rai@email.com',
    location: 'Chitwan',
    joinDate: '2024-03-05',
    status: 'active',
    routesUsed: 67
  },
  {
    id: 5,
    name: 'Sunita Thapa',
    email: 'sunita.t@email.com',
    location: 'Bhaktapur',
    joinDate: '2024-02-12',
    status: 'suspended',
    routesUsed: 23
  }
])

// Routes data (Nepal-specific, no trains)
const routes = ref([
  {
    id: 1,
    name: 'Ring Road Express',
    description: 'Fast route around Kathmandu Ring Road',
    type: 'bus',
    icon: 'bi bi-bus-front',
    status: 'active',
    users: 1250,
    avgTime: 25
  },
  {
    id: 2,
    name: 'Ratna Park - Balaju',
    description: 'Main route connecting city center to Balaju',
    type: 'micro',
    icon: 'bi bi-truck',
    status: 'active',
    users: 890,
    avgTime: 18
  },
  {
    id: 3,
    name: 'Airport Shuttle',
    description: 'Direct connection to Tribhuvan Airport',
    type: 'bus',
    icon: 'bi bi-airplane',
    status: 'maintenance',
    users: 450,
    avgTime: 35
  },
  {
    id: 4,
    name: 'Kathmandu - Pokhara',
    description: 'Long distance tourist bus route',
    type: 'bus',
    icon: 'bi bi-bus-front-fill',
    status: 'active',
    users: 320,
    avgTime: 420
  }
])

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'user',
    icon: 'bi bi-person-plus',
    description: 'New user registered: Sita Gurung',
    time: '2 minutes ago',
    status: 'success',
    statusText: 'Completed'
  },
  {
    id: 2,
    type: 'route',
    icon: 'bi bi-map',
    description: 'Route updated: Ring Road Express',
    time: '15 minutes ago',
    status: 'info',
    statusText: 'Updated'
  },
  {
    id: 3,
    type: 'system',
    icon: 'bi bi-exclamation-triangle',
    description: 'System maintenance scheduled',
    time: '1 hour ago',
    status: 'warning',
    statusText: 'Pending'
  }
])

// Notifications
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

// Performance metrics
const performanceMetrics = ref([
  { name: 'Server Uptime', value: '99.7%', percentage: 99.7 },
  { name: 'Response Time', value: '1.8s', percentage: 75 },
  { name: 'Error Rate', value: '0.3%', percentage: 25 },
  { name: 'User Satisfaction', value: '4.6/5', percentage: 92 }
])

// Top cities (Nepal-specific)
const topCities = ref([
  { name: 'Kathmandu', users: 3250, percentage: 38 },
  { name: 'Pokhara', users: 1800, percentage: 21 },
  { name: 'Lalitpur', users: 1400, percentage: 16 },
  { name: 'Bhaktapur', users: 950, percentage: 11 },
  { name: 'Chitwan', users: 750, percentage: 9 },
  { name: 'Butwal', users: 400, percentage: 5 }
])

// Settings
const settings = reactive({
  appName: 'Yatra',
  defaultLanguage: 'ne',
  maintenanceMode: false,
  emailNotifications: true,
  pushNotifications: true
})

// Computed properties
const totalUsers = computed(() => users.value.length)
const unreadFeedback = computed(() => 5)
const totalRoutes = computed(() => routes.value.reduce((sum, route) => sum + route.users, 0))

const filteredUsers = computed(() => {
  let filtered = users.value

  if (userSearchQuery.value) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    )
  }

  if (userStatusFilter.value) {
    filtered = filtered.filter(user => user.status === userStatusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const getPageTitle = () => {
  const titles = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    users: 'User Management',
    routes: 'Route Management',
    feedback: 'User Feedback',
    settings: 'Settings',
    reports: 'Reports'
  }
  return titles[activeTab.value] || 'Dashboard'
}

const getPageSubtitle = () => {
  const subtitles = {
    dashboard: 'Overview of your Yatra application',
    analytics: 'Detailed insights and metrics',
    users: 'Manage user accounts and permissions',
    routes: 'Configure and monitor transport routes',
    feedback: 'User reviews and feedback',
    settings: 'Application configuration',
    reports: 'Generate and view reports'
  }
  return subtitles[activeTab.value] || ''
}

const refreshData = async () => {
  isRefreshing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
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

const updateUserGrowthChart = () => {
  // Simulate chart data update
  const periods = {
    '7d': [35, 42, 38, 51, 45, 57, 63],
    '30d': [120, 135, 148, 162, 155, 167, 173, 180, 195, 210],
    '90d': [800, 950, 1080, 1220, 1150, 1270, 1330, 1400, 1550, 1700]
  }
  userGrowthData.value = periods[userGrowthPeriod.value] || periods['30d']
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US')
}

const editUser = (user) => {
  console.log('Edit user:', user)
}

const viewUser = (user) => {
  console.log('View user:', user)
}

const deleteUser = (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const saveSettings = () => {
  console.log('Settings saved:', settings)
  alert('Settings saved successfully!')
}

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    Object.assign(settings, {
      appName: 'Yatra',
      defaultLanguage: 'ne',
      maintenanceMode: false,
      emailNotifications: true,
      pushNotifications: true
    })
  }
}

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    console.log('Logging out...')
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

// Lifecycle hooks
onMounted(() => {
  updateDateTime()
  const interval = setInterval(updateDateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
