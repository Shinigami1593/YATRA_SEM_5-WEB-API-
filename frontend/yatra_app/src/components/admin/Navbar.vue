<template>
  <header class="main-header">
    <div class="header-left">
      <h1>{{ getPageTitle() }}</h1>
      <p class="header-subtitle">{{ getPageSubtitle() }}</p>
    </div>
    <div class="header-right">
      <div class="header-actions">
        <button class="action-btn" @click="$emit('refresh')">
          <i
            class="bi bi-arrow-clockwise"
            :class="{ spinning: isRefreshing }"
          ></i>
        </button>
        <button class="action-btn" @click="$emit('toggle-notifications')">
          <i class="bi bi-bell"></i>
          <span v-if="notifications.length > 0" class="notification-count">{{
            notifications.length
          }}</span>
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
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from "vue";

defineProps({ activeTab: String, isRefreshing: Boolean, notifications: Array });
const emit = defineEmits(["refresh", "toggle-notifications"]);

const currentTime = ref("");
const currentDate = ref("");

const getPageTitle = () =>
  ({
    dashboard: "Dashboard",
    analytics: "Analytics",
    users: "User Management",
    routes: "Route Management",
    feedback: "User Feedback",
    settings: "Settings",
    reports: "Reports",
  }[activeTab] || "Dashboard");
const getPageSubtitle = () =>
  ({
    dashboard: "Overview of your Yatra application",
    analytics: "Detailed insights and metrics",
    users: "Manage user accounts",
    routes: "Configure transport routes",
    feedback: "User reviews",
    settings: "App configuration",
    reports: "Generate reports",
  }[activeTab] || "");

const updateDateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  currentDate.value = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
onUnmounted(() => clearInterval());
</script>

<style scoped>
.main-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a1a;
}
.header-left h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
}
.header-subtitle {
  margin: 0.25rem 0 0 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #333333;
  background: transparent;
  color: #a0a0a0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.action-btn:hover {
  border-color: #00d664;
  color: #00d664;
}
.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
.date-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.9rem;
}
.time {
  font-weight: 600;
  color: #00d664;
}
.date {
  color: #a0a0a0;
  font-size: 0.8rem;
}
@media (max-width: 480px) {
  .header-actions {
    gap: 0.5rem;
  }
  .date-time {
    display: none;
  }
}
</style>
