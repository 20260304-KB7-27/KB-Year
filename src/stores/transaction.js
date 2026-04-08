import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios'; // 상대방이 사용한 axios 추가

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedDate = ref(new Date());

  const getMonthRange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const from = new Date(year, month, 1, 0, 0, 0).toISOString();
    const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    return { from, to };
  };

  const fetchMonthlyData = async (userId = 'user1') => {
    isLoading.value = true;
    try {
      const { from, to } = getMonthRange(selectedDate.value);
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(uri, {
        params: { userid: userId, date_gte: from, date_lte: to },
      });
      monthlyTrans.value = response.data;
    } catch (err) {
      console.error('Data Load Failed:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const changeMonth = async (offset) => {
    const newDate = new Date(selectedDate.value);
    newDate.setMonth(newDate.getMonth() + offset);
    selectedDate.value = newDate;
    await fetchMonthlyData();
  };

  // 'transactions'를 'monthlyTrans'의 Alias로 설정
  const transactions = computed(() => monthlyTrans.value);

  const filteredTransactions = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    return monthlyTrans.value.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
  });

  const totalIncome = computed(() => {
    const test = monthlyTrans.value
      .filter((t) => t.type?.toUpperCase() === 'INCOME')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
    console.log(test);
    return test;
  });

  const totalExpense = computed(() => {
    return monthlyTrans.value
      .filter((t) => t.type?.toUpperCase() === 'EXPENSE')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  const netProfit = computed(() => totalIncome.value - totalExpense.value);

  const getUserTransaction = async (id, from, to) => {
    if (!id) return;
    isLoading.value = true;
    try {
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(`${uri}?userid=${id}&date_gte=${from}&date_lte=${to}`);
      monthlyTrans.value = response.data;
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  function setMonth(date) {
    selectedDate.value = date;
  }

  return {
    monthlyTrans,
    selectedDate,
    totalIncome,
    totalExpense,
    netProfit,
    isLoading,
    getUserTransaction,
    setMonth,
    fetchMonthlyData,
    changeMonth,
  };
});
