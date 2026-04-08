import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedDate = ref(new Date());

  const filteredTransactions = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();

    // 선택한 월 데이터 로딩
    return monthlyTrans.value.filter((t) => {
      const tDate = new Date(t.timestamp);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
  });

  // 총 수입
  const totalIncome = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.type === 'income')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  // 총 지출
  const totalExpense = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.category === 'expense')
      .reduce((acc, cur) => acc + cur.amount, 0);
  });

  // 순수익
  const netProfit = computed(() => totalIncome.value - totalExpense.value);

  // transactions 데이터 불러오기
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

  // selectedDate를 사용자가 선택한 특정 날짜로 교체
  function setMonth(date) {
    selectedDate.value = date;
  }

  // 거래 추가
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
