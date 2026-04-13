<template>
  <RouterView />
  <Toaster
    position="top-center"
    rich-colors
    close-button
  />
</template>

<script setup>
import 'vue-sonner/style.css';
import { Toaster } from './components/ui/sonner';
</script>

<style scoped></style>
