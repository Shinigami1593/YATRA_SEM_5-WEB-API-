<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <i class="bi bi-compass"></i>
        <span v-if="!collapsed">Yatra Admin</span>
      </div>
      <button
        class="sidebar-toggle"
        @click="$emit('update:collapsed', !collapsed)"
      >
        <i
          :class="collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"
        ></i>
      </button>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 v-if="!collapsed">Overview</h4>
        <ul>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'dashboard')"
              :class="{ active: activeTab === 'dashboard' }"
              ><i class="bi bi-speedometer2"></i
              ><span v-if="!collapsed">Dashboard</span></a
            >
          </li>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'analytics')"
              :class="{ active: activeTab === 'analytics' }"
              ><i class="bi bi-graph-up"></i
              ><span v-if="!collapsed">Analytics</span></a
            >
          </li>
        </ul>
      </div>
      <div class="nav-section">
        <h4 v-if="!collapsed">Management</h4>
        <ul>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'users')"
              :class="{ active: activeTab === 'users' }"
              ><i class="bi bi-people"></i
              ><span v-if="!collapsed"
                >Users<span class="badge">{{ totalUsers }}</span></span
              ></a
            >
          </li>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'routes')"
              :class="{ active: activeTab === 'routes' }"
              ><i class="bi bi-map"></i><span v-if="!collapsed">Routes</span></a
            >
          </li>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'feedback')"
              :class="{ active: activeTab === 'feedback' }"
              ><i class="bi bi-chat-square-text"></i
              ><span v-if="!collapsed"
                >Feedback<span v-if="unreadFeedback > 0" class="badge alert">{{
                  unreadFeedback
                }}</span></span
              ></a
            >
          </li>
        </ul>
      </div>
      <div class="nav-section">
        <h4 v-if="!collapsed">System</h4>
        <ul>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'settings')"
              :class="{ active: activeTab === 'settings' }"
              ><i class="bi bi-gear"></i
              ><span v-if="!collapsed">Settings</span></a
            >
          </li>
          <li>
            <a
              href="#"
              @click="$emit('set-tab', 'reports')"
              :class="{ active: activeTab === 'reports' }"
              ><i class="bi bi-file-earmark-text"></i
              ><span v-if="!collapsed">Reports</span></a
            >
          </li>
        </ul>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-profile">
        <div class="profile-avatar"><i class="bi bi-person-circle"></i></div>
        <div v-if="!collapsed" class="profile-info">
          <h5>{{ adminUser.name }}</h5>
          <span>{{ adminUser.role }}</span>
        </div>
      </div>
      <button
        class="logout-btn"
        @click="logout"
        :title="collapsed ? 'Logout' : ''"
      >
        <i class="bi bi-box-arrow-right"></i
        ><span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
defineProps({
  collapsed: Boolean,
  activeTab: String,
  totalUsers: Number,
  unreadFeedback: Number,
  adminUser: Object,
});
const emit = defineEmits(["update:collapsed", "set-tab"]);
const logout = () => {
  if (confirm("Are you sure you want to logout?"))
    console.log("Logging out...");
};
</script>

<style scoped>
/* Sidebar styles (same as original, moved here) */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border-right: 1px solid #333333;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
}
.sidebar.collapsed {
  width: 80px;
}
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #00d664;
}
.logo i {
  font-size: 1.5rem;
}
.sidebar-toggle {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}
.sidebar-toggle:hover {
  background: rgba(0, 214, 100, 0.1);
  color: #00d664;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}
.nav-section {
  margin-bottom: 2rem;
}
.nav-section h4 {
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.nav-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-section li {
  margin-bottom: 0.25rem;
}
.nav-section a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: #a0a0a0;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}
.nav-section a:hover {
  background: rgba(0, 214, 100, 0.1);
  color: #00d664;
}
.nav-section a.active {
  background: rgba(0, 214, 100, 0.15);
  color: #00d664;
  border-right: 3px solid #00d664;
}
.nav-section a i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}
.badge {
  background: #00d664;
  color: #000000;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  margin-left: auto;
}
.badge.alert {
  background: #ef4444;
  color: white;
}
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #333333;
}
.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.profile-avatar {
  font-size: 2rem;
  color: #00d664;
}
.profile-info h5 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.profile-info span {
  font-size: 0.8rem;
  color: #666666;
}
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #333333;
  border-radius: 8px;
  color: #a0a0a0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
@media (max-width: 1200px) {
  .sidebar.collapsed {
    width: 60px;
  }
}
@media (max-width: 768px) {
  .sidebar {
    left: -280px;
  }
  .sidebar.open {
    left: 0;
  }
}
</style>
