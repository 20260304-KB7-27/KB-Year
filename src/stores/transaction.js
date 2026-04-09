import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);
  const isLoading = ref(false);
  // const error = ref(null);
  const selectedDate = ref(new Date());
  const url = 'http://localhost:3000/transactions';

  /* 캘린더 + barChart용 */
  const durationTrans = ref({
    expense: [],
    income: [],
  });

  const getDurationTransaction = async (id, from, to) => {
    try {
      const url =
        import.meta.env.VITE_LIVE === '0'
          ? import.meta.env.VITE_API_URL_LOCAL
          : import.meta.env.VITE_API_URL;
      const uri = `${url}/transactions`;
      const response = await axios.get(uri, {
        params: { userid: id, date_gte: from, date_lte: to },
      });
      if (response.status === 200) {
        // console.log(response.data);
        // console.log(response.data.filter((t) => t.type === 'income'));
        durationTrans.value.income = response.data.filter((t) => t.type === 'income');
        durationTrans.value.expense = response.data.filter((t) => t.type === 'expense');
        // console.log(durationTrans.value);
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

  const dateTransactionNumber = computed(() => {
    const data = {};
    const allTransactions = monthlyTrans.value;

    allTransactions.forEach((t) => {
      if (!t.date) return; // 날짜가 없는 데이터는 무시 (안전장치)
      const dateStr =
        typeof t.date === 'string'
          ? t.date.split('T')[0]
          : `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}-${String(t.date.getDate()).padStart(2, '0')}`;
      if (!data[dateStr]) {
        data[dateStr] = [0, 0];
      }
      if (t.type === 'income') {
        data[dateStr][0]++;
      } else if (t.type === 'expense') {
        data[dateStr][1]++;
      }
    });
    return data;
  });

  const dateRange = computed(() => {
    const date = selectedDate.value;
    const year = date.getFullYear();
    const month = date.getMonth();
    const from = new Date(year, month, 1, 0, 0, 0).toISOString();
    const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    return { from, to };
  });

  const totalIncome = computed(() => {
    return monthlyTrans.value
      .filter((t) => t.type?.toUpperCase() === 'INCOME')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  const totalExpense = computed(() => {
    return monthlyTrans.value
      .filter((t) => t.type?.toUpperCase() === 'EXPENSE')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  const netProfit = computed(() => totalIncome.value - totalExpense.value);

  const getUserTransaction = async (id, type, from, to) => {
    try {
      const url =
        import.meta.env.VITE_LIVE === '0'
          ? import.meta.env.VITE_API_URL_LOCAL
          : import.meta.env.VITE_API_URL;
      const uri = `${url}/transactions`;
      const response = await axios.get(uri, {
        params: { userid: id, type: type, date_gte: from, date_lte: to },
      });
      monthlyTrans.value = response.data;
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const getUserAllTransaction = async (id, from, to) => {
    try {
      const url =
        import.meta.env.VITE_LIVE === '0'
          ? import.meta.env.VITE_API_URL_LOCAL
          : import.meta.env.VITE_API_URL;
      const uri = `${url}/transactions`;
      // console.log(uri, id, from, to);
      const response = await axios.get(uri, {
        params: { userid: id, date_gte: from, date_lte: to, _sort: '-date' },
      });
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

  const fetchTransactions = async (userId) => {
    if (!userId) return;

    isLoading.value = true;
    const { from, to } = dateRange.value;

    try {
      const response = await axios.get(url, {
        params: {
          userid: userId,
          date_gte: from,
          date_lte: to,
          _sort: 'date',
          _order: 'desc',
        },
      });
      monthlyTrans.value = response.data;
    } catch (err) {
      console.error('Data Fetch Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const changeMonth = async (offset, userId) => {
    const newDate = new Date(selectedDate.value);
    newDate.setMonth(newDate.getMonth() + offset);
    selectedDate.value = newDate;

    await fetchTransactions(userId);
  };

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
    dateTransactionNumber,
    getUserTransaction,
    getUserAllTransaction,
    getDurationTransaction,
    setMonth,
    fetchTransactions,
    changeMonth,
  };
});
