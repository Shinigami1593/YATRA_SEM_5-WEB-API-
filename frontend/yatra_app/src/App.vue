<script setup>
import Footer from './components/Footer.vue'
import Navbar from './components/NavigationBar.vue'
</script>

<template>
  <div>
    <Navbar />
    <div style="height: 80vh;">
      <RouterView />
    </div>
    <!-- <Footer /> -->
  </div>
</template>

<style scoped></style>