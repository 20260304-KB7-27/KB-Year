<template>
  <Dialog v-model:open="open">
    <DialogTrigger
      class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#645B4C] text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-[#A39B8F]"
    >
      <PlusIcon class="h-5 w-5" />
    </DialogTrigger>

    <DialogContent class="max-w-[380px] rounded-[24px] border-none bg-[#f4f2ee] p-0 shadow-2xl">
      <div class="p-6">
        <DialogHeader class="mb-5">
          <DialogTitle class="text-[20px] font-extrabold tracking-[-0.02em] text-[#4b4b4b]">
            거래 등록
          </DialogTitle>
          <DialogDescription class="text-sm text-[#8d8d8d]">
            수입 또는 지출 내역을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <TradeForm
          mode="create"
          @submit="handleSubmit"
          @cancel="open = false"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@lucide/vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTransactionsStore } from '@/stores/transactions';
import { useUserStore } from '@/stores/user';
import TradeForm from '@/components/tradeList/TradeForm.vue';

const open = ref(false);

const store = useTransactionsStore();
const userStore = useUserStore();

const handleSubmit = async (payload) => {
  await store.addTransaction({
    ...payload,
    userid: userStore.user.userid,
  });

  open.value = false;
};
</script>
