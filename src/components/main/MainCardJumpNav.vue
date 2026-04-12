<script setup>
import draggable from 'vuedraggable';
import { storeToRefs } from 'pinia';
import { useMainCardsStore } from '@/stores/mainCards';
import { User, Activity, LayoutDashboard, Calendar, BarChart3, TrendingUp } from 'lucide-vue-next';

const TYPE_META = {
  user: { label: '프로필', Icon: User },
  activity: { label: '내역', Icon: Activity },
  dashboard: { label: '총계', Icon: LayoutDashboard },
  calendar: { label: '캘린더', Icon: Calendar },
  bar: { label: 'TOP3', Icon: BarChart3 },
  line: { label: '추이', Icon: TrendingUp },
};

const mainCardsStore = useMainCardsStore();
const { cards } = storeToRefs(mainCardsStore);

const emit = defineEmits(['jump']);
</script>

<template>
  <nav
    class="pointer-events-none fixed inset-x-0 bottom-0 z-35 sm:hidden"
    aria-label="카드 섹션 바로가기 · 순서 변경"
  >
    <div
      class="pointer-events-auto border-t border-[#e8e4dc]/90 bg-[#f4f2ee]/92 shadow-[0_-6px_24px_rgba(100,91,76,0.08)] backdrop-blur-md"
    >
      <draggable
        v-model="cards"
        item-key="id"
        tag="div"
        :delay="200"
        :delay-on-touch-only="true"
        animation="250"
        class="mx-auto flex w-full max-w-lg justify-center gap-1 overflow-x-auto px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <template #item="{ element }">
          <button
            type="button"
            class="flex min-w-[15%] shrink-0 cursor-grab flex-col items-center gap-0.5 rounded-2xl border border-[#e8e4dc]/80 bg-[#f4f2ee]/95 px-2.5 py-1.5 text-center text-[10px] font-semibold text-[#645b4c] shadow-[4px_4px_10px_#d9d5ce,-2px_-2px_8px_#ffffff] backdrop-blur-sm active:cursor-grabbing active:shadow-[inset_2px_2px_6px_#d9d5ce]"
            @click="emit('jump', element.type)"
          >
            <component
              :is="TYPE_META[element.type].Icon"
              class="h-4 w-4 text-[#E4A13A]"
              stroke-width="2"
            />
            <span class="whitespace-nowrap">{{ TYPE_META[element.type].label }}</span>
          </button>
        </template>
      </draggable>
    </div>
  </nav>
</template>
