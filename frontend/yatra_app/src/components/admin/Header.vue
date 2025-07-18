<template>
  <header class="main-header">
    <div class="header-left">
      <h1>{{ getPageTitle() }}</h1>
      <p class="header-subtitle">{{ getPageSubtitle() }}</p>
    </div>
    <div class="header-right">
      <div class="header-actions">
        <button class="action-btn" @click="$emit('toggleNotifications')">
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
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  activeTab: String,
  notifications: Array,
  currentTime: String,
  currentDate: String,
  getPageTitle: Function,
  getPageSubtitle: Function
})
</script>
