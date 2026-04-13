<script setup>
import { ref } from 'vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';

const date = ref(new Date());
const props = defineProps({
  data: Object,
});
</script>
<template>
  <Calendar
    mode="single"
    :selected="date"
    class="rounded-lg border"
    :data="data"
    @update:selected="(val) => (date = val)"
  />
</template>

<style scoped></style>
