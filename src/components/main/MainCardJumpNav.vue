<script setup>
import { User, Activity, LayoutDashboard, Calendar, BarChart3, TrendingUp } from 'lucide-vue-next';

const items = [
  { type: 'user', label: '프로필', Icon: User },
  { type: 'activity', label: '내역', Icon: Activity },
  { type: 'dashboard', label: '요약', Icon: LayoutDashboard },
  { type: 'calendar', label: '캘린더', Icon: Calendar },
  { type: 'bar', label: 'TOP3', Icon: BarChart3 },
  { type: 'line', label: '추이', Icon: TrendingUp },
];

const emit = defineEmits(['jump']);
</script>

<template>
  <nav
    class="pointer-events-none fixed inset-x-0 bottom-0 z-35 sm:hidden"
    aria-label="카드 섹션 바로가기"
  >
    <div
      class="pointer-events-auto border-t border-[#e8e4dc]/90 bg-[#f4f2ee]/92 shadow-[0_-6px_24px_rgba(100,91,76,0.08)] backdrop-blur-md"
    >
      <div
        class="mx-auto flex w-full gap-1 justify-center overflow-x-auto content-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          v-for="item in items"
          :key="item.type"
          type="button"
          class="flex shrink-0 flex-col text-center items-center min-w-[15%] gap-0.5 rounded-2xl bg-[#f4f2ee]/95 px-2.5 py-1.5 text-[10px] font-semibold text-[#645b4c] shadow-[4px_4px_10px_#d9d5ce,-2px_-2px_8px_#ffffff] backdrop-blur-sm active:shadow-[inset_2px_2px_6px_#d9d5ce] border border-[#e8e4dc]/80"
          @click="emit('jump', item.type)"
        >
          <component
            :is="item.Icon"
            class="h-4 w-4 text-[#E4A13A]"
            stroke-width="2"
          />
          <span class="whitespace-nowrap">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
