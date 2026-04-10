<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-[#645B4C]">날짜</label>
      <input
        v-model="form.date"
        type="datetime-local"
        class="w-full rounded-xl border-none bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition duration-300 focus:ring-2 focus:ring-[#fcaf17]/40"
      />
      <p class="text-xs text-[#9b9488]">기본값: {{ formattedPreviewDate }}</p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-[#645B4C]">유형</label>
      <CustomSelect
        v-model="form.type"
        :options="typeOptions"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-[#645B4C]">카테고리</label>
      <CustomSelect
        v-model="form.category"
        :options="categoryOptions"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-[#645B4C]">가격</label>
      <div
        class="flex items-center rounded-xl bg-white/90 px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#fcaf17]/40"
      >
        <input
          v-model="form.amount"
          type="number"
          min="0"
          step="1"
          placeholder="3200"
          class="w-full border-none bg-transparent text-sm font-semibold text-slate-700 outline-none"
        />
        <span class="ml-2 shrink-0 text-sm font-bold text-[#8d8d8d]">원</span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-[#645B4C]">메모</label>
      <textarea
        v-model="form.memo"
        rows="4"
        placeholder="메모를 입력하세요"
        class="w-full resize-none rounded-xl border-none bg-white/90 px-3 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition duration-300 focus:ring-2 focus:ring-[#fcaf17]/40"
      />
    </div>

    <div class="mt-2 flex gap-3">
      <button
        type="button"
        class="flex-1 rounded-xl bg-[#e6e1d8] px-4 py-3 text-sm font-bold text-[#7a7469] transition hover:bg-[#ddd6ca]"
        @click="$emit('cancel')"
      >
        취소
      </button>

      <button
        type="submit"
        class="flex-1 rounded-xl bg-gradient-to-r from-[#fcaf17] to-[#fdb913] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import CustomSelect from '../ui/custom-select/CustomSelect.vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'create', // create | edit
  },
  initialValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['submit', 'cancel']);

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const toDateTimeLocal = (value) => {
  if (!value) return getCurrentDateTimeLocal();

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const form = reactive({
  date: getCurrentDateTimeLocal(),
  type: 'expense',
  category: '식비',
  amount: '',
  memo: '',
});

const typeOptions = [
  { label: '수입', value: 'income' },
  { label: '지출', value: 'expense' },
];

const categoryOptions = [
  { label: '식비', value: '식비' },
  { label: '문화/여가', value: '문화/여가' },
  { label: '쇼핑/생활', value: '쇼핑/생활' },
  { label: '주거비', value: '주거비' },
  { label: '부수입', value: '부수입' },
  { label: '교통비', value: '교통비' },
  { label: '주수입', value: '주수입' },
  { label: '기타', value: '기타' },
];

watch(
  () => props.initialValue,
  (value) => {
    form.date = toDateTimeLocal(value?.date);
    form.type = value?.type ?? 'expense';
    form.category = value?.category ?? '식비';
    form.amount = value?.amount ?? '';
    form.memo = value?.memo ?? '';
  },
  { immediate: true, deep: true }
);

const formattedPreviewDate = computed(() => {
  if (!form.date) return '';

  const date = new Date(form.date);

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
});

const submitLabel = computed(() => {
  return props.mode === 'edit' ? '수정하기' : '등록하기';
});

const handleSubmit = () => {
  emit('submit', {
    ...form,
    amount: Number(form.amount),
    date: new Date(form.date).toISOString(),
  });
};
</script>
