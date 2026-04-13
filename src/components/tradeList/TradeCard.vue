<template>
  <div class="flex items-center justify-between rounded-[22px] bg-[#f4f2ee] px-5 py-4 neo-outset">
    <div class="flex items-center gap-4">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f4f2ee] neo-inset"
        :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
      >
        <component
          :is="iconComponent"
          class="h-6 w-6"
        />
      </div>

      <div class="flex flex-col">
        <span
          class="text-[0.9em] font-extrabold leading-none text-[#4b4b4b] w-20 text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {{ transaction.memo }}
        </span>
        <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
          {{ transaction.category }}
        </span>
      </div>
    </div>

    <div class="flex flex-row items-end gap-3">
      <div class="my-auto flex flex-col items-end justify-center">
        <div class="flex flex-row mx-auto justify-end w-30">
          <span
            class="block text-[0.9em] font-extrabold leading-none text-left max-w-30 whitespace-nowrap overflow-hidden text-ellipsis"
            :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
          </span>
          <span
            class="text-[0.9em] font-extrabold leading-none"
            :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
            >원</span
          >
        </div>
        <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
          {{ formatTime(transaction.date) }}
        </span>
      </div>

      <div class="mx-auto my-auto flex flex-col items-center justify-center gap-3">
        <Dialog v-model:open="editOpen">
          <DialogTrigger as-child>
            <button
              class="group flex relative justify-center items-center rounded-md w-8 h-8 bg-[var(--card)] shadow-[4px_4px_8px_#c9c5bd,-4px_-4px_8px_#f5f1e9] transition-all duration-200 active:shadow-[inset_2px_2px_4px_#c9c5bd,inset_-2px_-2px_4px_#f5f1e9]"
            >
              <PencilIcon class="w-5 text-green-700 hover:text-green-900" />
              <span
                class="absolute bottom-10 scale-0 transition-all rounded bg-green-700/30 p-2 text-xs text-white group-hover:scale-100 w-10"
              >
                수정
              </span>
            </button>
          </DialogTrigger>

          <DialogContent
            class="max-w-[380px] rounded-[24px] border-none bg-[#f4f2ee] p-0 shadow-2xl"
          >
            <div class="p-6">
              <DialogHeader class="mb-5">
                <DialogTitle class="text-[20px] font-extrabold tracking-[-0.02em] text-[#4b4b4b]">
                  거래 수정
                </DialogTitle>
                <DialogDescription class="text-sm text-[#8d8d8d]">
                  거래 내역을 수정해 주세요.
                </DialogDescription>
              </DialogHeader>

              <TradeForm
                mode="edit"
                :initial-value="transaction"
                @submit="handleEditSubmit"
                @cancel="editOpen = false"
              />
            </div>
          </DialogContent>
        </Dialog>

        <button
          class="group flex relative justify-center items-center rounded-sm w-8 h-8 bg-[var(--card)] shadow-[4px_4px_8px_#c9c5bd,-4px_-4px_8px_#f5f1e9] transition-all duration-200 active:shadow-[inset_2px_2px_4px_#c9c5bd,inset_-2px_-2px_4px_#f5f1e9]"
          @click="handleDelete"
        >
          <TrashIcon class="w-5 text-red-700 hover:text-red-900" />
          <span
            class="absolute top-10 scale-0 transition-all rounded bg-red-700/30 p-2 text-xs text-white group-hover:scale-100 w-10"
          >
            삭제
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { UtensilsCrossed, Gift, ShoppingBag } from 'lucide-vue-next';
import { TrashIcon, PencilIcon } from '@lucide/vue';
import { formatTime } from '@/utils/date.js';
import { useTransactionsStore } from '@/stores/transactions';
import TradeForm from '@/components/tradeList/TradeForm.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const store = useTransactionsStore();
const editOpen = ref(false);

const iconComponent = computed(() => {
  if (props.transaction.type === 'income') return Gift;
  if (props.transaction.category?.includes('쇼핑')) return ShoppingBag;
  return UtensilsCrossed;
});

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

const handleEditSubmit = async (payload) => {
  await store.updateTransaction(props.transaction.id, payload);
  editOpen.value = false;
};

const handleDelete = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await store.deleteTransaction(props.transaction.id);
  } else {
    return;
  }
};
</script>

<style scoped>
.neo-outset {
  box-shadow:
    10px 10px 20px #d9d4cd,
    -10px -10px 20px #fffdf8;
}

.neo-inset {
  box-shadow:
    inset 6px 6px 12px #ddd8d1,
    inset -6px -6px 12px #fffdf8;
}
</style>
