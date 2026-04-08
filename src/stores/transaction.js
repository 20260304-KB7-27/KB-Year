import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios'; // 상대방이 사용한 axios 추가

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedDate = ref(new Date());

  /* 캘린더 + piechart용 */
  const durationTrans = ref({
    expense: [],
    income: [],
  });

  const getDurationTransaction = async (id, from, to) => {
    try {
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(`${uri}?userid=${id}&date_gte=${from}&date_lte=${to}`);
      if (response.status === 200) {
        console.log(response.data);
        // console.log(response.data.filter((t) => t.type === 'income'));
        durationTrans.value.income = response.data.filter((t) => t.type === 'income');
        durationTrans.value.expense = response.data.filter((t) => t.type === 'expense');
        console.log(durationTrans.value);
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const durationTransactions = computed(() => durationTrans.value);

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

  const getUserTransaction = async (id, type, from, to) => {
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

  const getUserAllTransaction = async (id, from, to) => {
    try {
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(
        `${uri}?userid=${id}&date_gte=${from}&date_lte=${to}&_sort=-date`
      );
      if (response.status === 200) {
        monthlyTrans.value = response.data;
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

  return {
    monthlyTrans,
    durationTrans,
    durationTransactions,
    transactions,
    selectedDate,
    totalIncome,
    totalExpense,
    netProfit,
    isLoading,
    getUserTransaction,
    getUserAllTransaction,
    getDurationTransaction,
    setMonth,
  };
});
