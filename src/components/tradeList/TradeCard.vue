<template>
  <div class="flex items-center justify-between rounded-[22px] bg-[#f4f2ee] px-5 py-4 neo-outset">
    <div class="flex items-center gap-4">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f4f2ee] neo-inset"
        :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
      >
        <component
          :is="iconComponent"
          class="h-6 w-6"
        />
      </div>

      <div class="flex flex-col">
        <span class="text-[15px] font-extrabold leading-none text-[#4b4b4b]">
          {{ transaction.memo }}
        </span>
        <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
          {{ transaction.category }}
        </span>
      </div>
    </div>

    <div class="flex flex-row items-end gap-5">
      <div class="my-auto flex flex-col items-end justify-center">
        <span
          class="text-[15px] font-extrabold leading-none"
          :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
        >
          {{ transaction.type === 'income' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}원
        </span>
        <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
          {{ formatTime(transaction.date) }}
        </span>
      </div>

      <div class="mx-auto my-auto flex flex-col items-center justify-center gap-3">
        <Dialog v-model:open="editOpen">
          <DialogTrigger as-child>
            <button>
              <PencilIcon class="w-5 text-red-700" />
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

        <button @click="handleDelete">
          <TrashIcon class="w-5 text-green-700" />
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
  await store.deleteTransaction(props.transaction.id);
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
