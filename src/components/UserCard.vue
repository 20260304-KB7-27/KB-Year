<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useDurationStore } from '@/stores/duration';
import { LogOut, Settings, Award, Shield, Crown, Zap, User } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
// 1. 기본 유저 정보 (추후 DB 연동 가능)
const { user } = storeToRefs(useUserStore());
const { netProfit } = useDurationStore();

// 3. 절대평가 등급 기준 정의 (금액 단위: KRW)
const tiers = {
  BRONZE: {
    min: -Infinity,
    max: 0,
    desc: '이제 시작해요! 저축 습관 만들기 🌱',
    icon: Zap,
    bg: 'bg-[#cd7f32]',
    color: 'text-white', // 브론즈는 진해서 흰색이 잘 보여요
  },
  SILVER: {
    min: 1,
    max: 500000,
    desc: '차곡차곡 쌓여가는 기쁨! 실버 🥈',
    icon: Shield,
    bg: 'bg-[#b0b0b0]', // 실버를 약간 더 진하게 조정
    color: 'text-[#4a4a4a]', // 실버 배경엔 진한 회색 텍스트
  },
  GOLD: {
    min: 500001,
    max: 1000000,
    desc: '현명한 소비의 달인! 골드 🥇',
    icon: Award,
    bg: 'bg-[#ffd700]',
    color: 'text-[#645b4c]', // 골드엔 갈색톤 텍스트가 고급스럽습니다
  },
  PLATINUM: {
    min: 1000001,
    max: Infinity,
    desc: '자산 관리의 신! 플래티넘 🏆',
    icon: Crown,
    bg: 'bg-[#10b981]', // 초록색 계열로 변경
    color: 'text-white', // 초록 배경에 잘 보이도록 흰색 글자
  },
};
// 4. 현재 수익에 따른 등급 및 스타일 계산
const currentTier = computed(() => {
  if (netProfit.value <= 0) return 'BRONZE';
  if (netProfit.value <= 500000) return 'SILVER';
  if (netProfit.value <= 1000000) return 'GOLD';
  return 'PLATINUM';
});

const tierStyle = computed(() => tiers[currentTier.value]);

// 5. 다음 등급까지 남은 금액 및 진행률 계산
const nextTier = computed(() => {
  if (currentTier.value === 'BRONZE') return 'SILVER';
  if (currentTier.value === 'SILVER') return 'GOLD';
  if (currentTier.value === 'GOLD') return 'PLATINUM';
  return null;
});

const remainingProfit = computed(() => {
  if (!nextTier.value) return 0;
  const nextMin = tiers[nextTier.value].min;
  return Math.max(0, nextMin - netProfit.value);
});

const tierProgress = computed(() => {
  if (currentTier.value === 'PLATINUM') return 100;
  const currentRange = tiers[currentTier.value];
  const min = currentRange.min === -Infinity ? 0 : currentRange.min;
  const max = currentRange.max;
  const range = max - min;
  const current = netProfit.value - min;
  return Math.min(100, Math.max(0, (current / range) * 100));
});

// 6. 액션 핸들러
const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    console.log('Logout logic here');
    // 예: authStore.logout(); router.push('/login');
  }
};

const openEditProfile = () => {
  console.log('Navigate to edit profile page or open drawer');
  // 예: router.push('/profile/edit');
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="mb-5">
      <div class="flex justify-center items-center gap-3 mb-3">
        <h2 class="text-[#645b4c] font-bold text-2xl">{{ user.name }}</h2>

        <!-- <button
          @click="handleLogout"
          class="flex items-center gap-1 px-2 py-1 rounded-lg text-[#a39b8f] hover:text-red-400 hover:bg-red-50/50 transition-all text-[10px] font-bold cursor-pointer"
          title="로그아웃"
        >
          <LogOut class="w-3 h-3" />
          <span>LOGOUT</span>
        </button> -->
      </div>
      <!-- <h2 class="text-3xl font-bold text-[#645b4c] mb-1">{{ user.name }}</h2> -->
      <p
        class="text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-5"
        :class="[tiers[currentTier].bg, tiers[currentTier].color]"
      >
        {{ tiers[currentTier].desc }}
      </p>
      <!-- 이달의 순수익 등급 -->
      <div
        class="w-full bg-[#f4f2ee] rounded-3xl p-5 mb-8 shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff]"
      >
        <div class="flex justify-between text-[10px] text-[#a39b8f] mb-2">
          <span class="font-medi um">이번 달 순수익 등급</span>
          <span class="font-bold text-[#645b4c] tracking-wider">{{ currentTier }}</span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#fcaf17] transition-all duration-700 ease-out"
            :style="{ width: tierProgress + '%' }"
          ></div>
        </div>
        <p class="text-[9px] text-[#a39b8f] mt-2.5 text-center font-medium">
          현재 수익:
          <span class="text-[#645b4c] font-bold">₩{{ netProfit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
