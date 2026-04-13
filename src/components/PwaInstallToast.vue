<template>
  <div
    class="flex flex-col mx-auto justify-center w-[300px] sm:w-[375px] bg-white/80 rounded-2xl p-5 shadow-lg border border-gray-100"
  >
    <div class="text-xs sm:text-sm font-medium text-slate-900 mb-2 text-start">
      앱으로 더 편하게 이용해보세요
    </div>
    <p class="text-xs sm:text-sm text-slate-800 leading-relaxed mb-4 text-start">
      홈 화면에 추가하면 캐비어를 빠르게 이용할 수 있어요 !
    </p>
    <div class="flex justify-end gap-2 w-full">
      <button
        type="button"
        class="px-4 py-1 rounded-lg bg-gray-100 text-slate-700 text-xs sm:text-sm hover:bg-gray-200"
        @click="dismiss"
      >
        취소
      </button>
      <button
        type="button"
        class="px-4 py-1 rounded-lg bg-amber-400 text-white text-xs sm:text-sm font-semibold hover:bg-amber-500"
        @click="onDownload"
      >
        다운로드
      </button>
    </div>
    <button
      type="button"
      class="mt-3 text-[11px] sm:text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
      @click="onSnooze"
    >
      하루 동안 알림 뜨지 않기
    </button>
  </div>
</template>

<script setup>
import { snoozePwaInstallToastOneDay } from '@/utils/pwaInstallToastStorage.js';
import { usePwaInstall } from '@/composables/usePwaInstall';

const { installPwa } = usePwaInstall();

const props = defineProps({
  /** vue-sonner가 커스텀 토스트에 주입 */
  onCloseToast: {
    type: Function,
    default: undefined,
  },
});

const dismiss = () => {
  props.onCloseToast?.();
};

const onDownload = async () => {
  props.onCloseToast?.();
  await installPwa();
};

const onSnooze = () => {
  snoozePwaInstallToastOneDay();
  props.onCloseToast?.();
};
</script>
