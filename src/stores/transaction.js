import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios'; // 상대방이 사용한 axios 추가

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedDate = ref(new Date());

  // 'transactions'를 'monthlyTrans'의 Alias로 설정
  const transactions = computed(() => monthlyTrans.value);

  const filteredTransactions = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    return monthlyTrans.value.filter((t) => {
      const tDate = new Date(t.timestamp);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
  });

  const totalIncome = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.category === 'INCOME')
      .reduce((acc, cur) => acc + cur.amount, 0);
  });

  const totalExpense = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.category === 'EXPENSE')
      .reduce((acc, cur) => acc + cur.amount, 0);
  });

  const netProfit = computed(() => totalIncome.value - totalExpense.value);

  const getUserTransaction = async (id, type, from, to) => {
    try {
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(
        `${uri}?userid=${id}&type=${type}&date_gte=${from}&date_lte=${to}`
      );
      if (response.status === 200) {
        monthlyTrans.value = response.data;
        console.log('데이터 로드 성공:', monthlyTrans.value);
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  function setMonth(date) {
    selectedDate.value = date;
  }

  async function addTransaction(payload) {
    try {
      const response = await axios.post('http://localhost:3000/transactions', payload);
      if (response.status === 201) {
        await getUserTransaction(payload.userid || payload.senderId);
      }
    } catch (err) {
      console.error('Add Error:', err);
    }
  }

  return {
    monthlyTrans,
    transactions,
    selectedDate,
    filteredTransactions,
    totalIncome,
    totalExpense,
    netProfit,
    isLoading,
    getUserTransaction,
    setMonth,
    addTransaction,
  };
});
