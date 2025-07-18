<template>
  <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <i class="bi bi-compass"></i>
        <span v-if="!sidebarCollapsed">Yatra Admin</span>
      </div>
      <button class="sidebar-toggle" @click="$emit('toggleSidebar')">
        <i :class="sidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 v-if="!sidebarCollapsed">Overview</h4>
        <ul>
          <li>
            <a href="#" @click.prevent="$emit('changeTab', 'dashboard')" :class="{ 'active': activeTab === 'dashboard' }">
              <i class="bi bi-speedometer2"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h4 v-if="!sidebarCollapsed">Management</h4>
        <ul>
          <li>
            <a href="#" @click.prevent="$emit('changeTab', 'users')" :class="{ 'active': activeTab === 'users' }">
              <i class="bi bi-people"></i>
              <span v-if="!sidebarCollapsed">Users</span>
              <span v-if="!sidebarCollapsed" class="badge">{{ totalUsers }}</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="$emit('changeTab', 'routes')" :class="{ 'active': activeTab === 'routes' }">
              <i class="bi bi-map"></i>
              <span v-if="!sidebarCollapsed">Trip</span>
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
          <h5>{{ adminUser.email }}</h5>
          <span>{{ adminUser.role }}</span>
        </div>
      </div>
      <button class="logout-btn" @click="$emit('logout')" :title="sidebarCollapsed ? 'Logout' : ''">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="!sidebarCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue'
// import 'Admin.css'

const props = defineProps({
  sidebarCollapsed: Boolean,
  activeTab: String,
  totalUsers: Number,
  adminUser: Object
})
</script>
