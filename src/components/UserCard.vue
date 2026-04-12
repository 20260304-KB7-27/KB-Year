<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useDurationStore } from '@/stores/duration';
import { LogOut, Settings, Award, Shield, Crown, Zap, User } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import EditProfile from './profile/EditProfile.vue';
// 1. 기본 유저 정보 (추후 DB 연동 가능)
const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const { signOut } = userStore;
const durationStore = useDurationStore();
const netProfit = computed(() => (durationStore.netProfit < 0 ? 0 : durationStore.netProfit));

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    try {
      await signOut(); // 여기서 실제 로그아웃 함수 호출
      useRouter().push('/login');
      // 필요하다면 여기서 router.push('/login') 등을 추가하세요.
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
};

// 3. 절대평가 등급 기준 정의 (금액 단위: KRW)
const tiers = {
  BRONZE: {
    min: -Infinity,
    max: 0,
    desc: '이제 시작해요! 저축 습관 만들기 🌱',
    icon: Zap,
    bg: 'bg-[#cd7f32]',
    shadow: '#cd7f32',
    img: new URL('@/assets/image/bronze.png', import.meta.url).href,
    color: 'text-white', // 브론즈는 진해서 흰색이 잘 보여요
  },
  SILVER: {
    min: 1,
    max: 500000,
    desc: '차곡차곡 쌓여가는 기쁨! 실버 🥈',
    icon: Shield,
    bg: 'bg-[#b0b0b0]', // 실버를 약간 더 진하게 조정
    shadow: '#b0b0b0',
    img: new URL('@/assets/image/silver.png', import.meta.url).href,
    color: 'text-[#4a4a4a]', // 실버 배경엔 진한 회색 텍스트
  },
  GOLD: {
    min: 500001,
    max: 1000000,
    desc: '현명한 소비의 달인! 골드 🥇',
    icon: Award,
    bg: 'bg-[#ffd700]',
    shadow: '#ffd700',
    img: new URL('@/assets/image/gold.png', import.meta.url).href,
    color: 'text-[#645b4c]', // 골드엔 갈색톤 텍스트가 고급스럽습니다
  },
  PLATINUM: {
    min: 1000001,
    max: Infinity,
    desc: '자산 관리의 신! 플래티넘 🏆',
    icon: Crown,
    bg: 'bg-[#10b981]', // 초록색 계열로 변경
    shadow: '#10b981',
    img: new URL('@/assets/image/platinum.png', import.meta.url).href,
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

const avatarClass = computed(
  () =>
    'w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-200 bg-[#f4f2ee]'
);
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Setting Modal -->
    <!-- <Settings
      class="cursor-pointer place-self-end group-hover:translate-x-0.5 transition-transform"
    /> -->
    <div class="place-self-end">
      <EditProfile />
    </div>
    <div class="mb-5 mt-10">
      <div class="flex justify-center items-center gap-3 mb-3">
        <div class="flex flex-col justify-center">
          <h2 class="text-[#645b4c] font-bold text-2xl">{{ user.name }}</h2>
          <button
            class="flex items-center gap-1.5 mt-1 px-1 py-1 rounded-full text-[#a39b8f] hover:text-red-500 hover:bg-red-50 transition-all text-[10px] font-bold cursor-pointer group"
            @click="handleLogout"
          >
            <LogOut class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>

        <!--  -->
        <div
          :class="avatarClass"
          :style="{ '--glow-color': tiers[currentTier].shadow }"
          class="glow-medal"
        >
          <img :src="tiers[currentTier].img" />
        </div>
      </div>
      <p
        class="text-xs font-semibold h-7 w-48 flex items-center justify-center rounded-full mb-5 shadow-sm"
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
            class="h-full transition-all duration-700 ease-out"
            :class="tiers[currentTier].bg"
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

<style scope>
.glow-medal {
  animation: glow 2s infinite ease-in-out;
}

@keyframes glow {
  0% {
    box-shadow: 0px 0px 10px var(--glow-color);
  }
  50% {
    box-shadow: 0px 0px 25px var(--glow-color);
  }
  100% {
    box-shadow: 0px 0px 10px var(--glow-color);
  }
}
</style>
