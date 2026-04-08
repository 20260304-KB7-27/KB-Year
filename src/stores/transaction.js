import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 선택된 월 (초기값: 현재 날짜)
  const selectedDate = ref(new Date());

  // 선택된 월 필터링
  const filteredTransactions = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    return transactions.value.filter((t) => {
      const tDate = new Date(t.timestamp);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
  });

  // 수입
  const totalIncome = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.category === 'INCOME')
      .reduce((acc, cur) => acc + cur.amount, 0);
  });

  // 지출
  const totalExpense = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.category === 'EXPENSE')
      .reduce((acc, cur) => acc + cur.amount, 0);
  });

  // 순수익
  const netProfit = computed(() => totalIncome.value - totalExpense.value);

  // 월 변경 함수 (컴포넌트에서 호출)
  function setMonth(date) {
    selectedDate.value = date;
  }

  async function fetchTransactions() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:3000/transactions');
      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
      const data = await response.json();
      transactions.value = data;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function addTransaction(payload) {
    try {
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) await fetchTransactions();
    } catch (err) {
      console.error('Add Error:', err);
    }
  }

  return {
    transactions,
    selectedDate,
    filteredTransactions,
    totalIncome,
    totalExpense,
    netProfit,
    isLoading,
    setMonth,
    fetchTransactions,
    addTransaction,
  };
});
