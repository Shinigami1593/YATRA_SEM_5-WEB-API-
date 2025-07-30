<template>
  <div class="users-tab">
    <div class="users-header">
      <div class="users-search">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" v-model="userSearchQuery" placeholder="Search users..." />
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
                <div class="user-avatar">
                  <img
                  :src="user.profilePicture ? getBackendImageUrl(user.profilePicture) : defaultAvatar"
                  alt="">
                </div>
                <div class="user-details">
                  <h5>{{ user.name }}</h5>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.joinDate) }}</td>
            <td>
              <div class="action-buttons">
                <!-- <button class="action-btn small" @click="$emit('edit-user', user)" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button> -->
                <button class="action-btn small danger" @click="$emit('delete-user', user)" title="Delete">
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import './Admin.css'
import { getBackendImageUrl } from '@/utils/imageHelpers'

const props = defineProps({
  users: Array,
  itemsPerPage: {
    type: Number,
    default: 10,
  }
})

const defaultAvatar = "https://avatar.iran.liara.run/public/boy"


const emit = defineEmits(['edit-user', 'delete-user'])

const userSearchQuery = ref('')
const currentPage = ref(1)

const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return props.users
  return props.users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  )
})


const totalPages = computed(() => Math.ceil(filteredUsers.value.length / props.itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// Reset page if search query changes and currentPage is out of range
watch(userSearchQuery, () => {
  currentPage.value = 1
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US')
}
</script>
