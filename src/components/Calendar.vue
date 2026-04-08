<script setup>
import { ref } from 'vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';

const date = ref(new Date());
</script>
<template>
  <Calendar
    mode="single"
    :selected="date"
    class="rounded-lg border"
    @update:selected="(val) => (date = val)"
  />
</template>

<style scoped></style>
