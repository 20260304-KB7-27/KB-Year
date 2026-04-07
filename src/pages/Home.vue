<template>
  <div>
    <Loading
      v-if="isLoading"
      @loading-complete="handleLoadingComplete"
    />

    <!-- 나중에 애니메이션 추가? -->
    <main
      v-else
      class="fade-in"
    >
      <h1>Welcome to PiggyBank!</h1>
      <p>랜딩 페이지 콘텐츠가 여기에 위치합니다.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Loading from './Loading.vue';

// 로딩 상태 관리 (기본값 true)
const isLoading = ref<boolean>(true);

// LoadingScreen에서 'loadingComplete' 이벤트가 오면 실행
const handleLoadingComplete = () => {
  isLoading.value = false;
};
</script>

<style scoped></style>
