import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

/*
연도, 월에 따른 거래 내역 조회시
fetchTransactions X getTransactionsByMonth 사용!

fetchTransactions 는 거래 수정/등록/삭제 시에만 호출해야 합니다!
*/
export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserId = ref(user?.userid ?? null);
  const url =
    import.meta.env.VITE_LIVE === '0'
      ? import.meta.env.VITE_API_URL_LOCAL
      : import.meta.env.VITE_API_URL;

  const lastQuery = ref({
    from: null,
    to: null,
  });

  const hasTransactions = computed(() => transactions.value.length > 0);

  // 로그인 유저의 전체 거래 내역 조회 (form, to X)
  const fetchTransactions = async (userId = currentUserId.value) => {
    if (!userId) return;

    isLoading.value = true;
    error.value = null;

    try {
      currentUserId.value = userId;

      const params = new URLSearchParams();
      params.append('userid', userId);
      console.log(params.toString());
      const response = await axios.get(`${url}/transactions?${params.toString()}`);
      console.log(response);
      transactions.value = response.data;
    } catch (err) {
      error.value = err;
      console.error('거래 내역 조회 실패:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 전체 거래 내역에서 해당 연도, 달 필터 적용 데이터
  const getTransactionsByMonth = (year, month) => {
    if (!Array.isArray(transactions.value)) {
      return [];
    }
    return transactions.value.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  // 전체 거래 내역에서 설정된 기간(lastQuery의 from ~ to)에 해당되는 데이터 가져오기
  const getTransactionsByDuration = () => {
    const { from, to } = lastQuery.value;

    if (!Array.isArray(transactions.value)) {
      return [];
    }

    if (!from && !to) {
      return transactions.value;
    }

    const fromTime = from ? new Date(from).getTime() : 0;
    const toTime = to ? new Date(to).getTime() : Infinity;

    return transactions.value.filter((t) => {
      const txTime = new Date(t.date).getTime();

      return txTime >= fromTime && txTime <= toTime;
    });
  };

  // 거래 등록 및 삭제 시 refetch
  const refetchTransactions = async () => {
    if (!currentUserId.value) return;

    await fetchTransactions(currentUserId.value);
  };

  // 거래 등록
  const addTransaction = async (payload) => {
    isLoading.value = true;
    error.value = null;

    try {
      await axios.post(`${url}/transactions`, payload);
      await refetchTransactions();
    } catch (err) {
      error.value = err;
      console.error('거래 등록 실패:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 거래 수정
  const updateTransaction = async (id, payload) => {
    isLoading.value = true;
    error.value = null;

    try {
      await axios.patch(`${url}/transactions/${id}`, payload);
      await refetchTransactions();
    } catch (err) {
      error.value = err;
      console.error('거래 수정 실패:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 거래 삭제
  const deleteTransaction = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      await axios.delete(`${url}/transactions/${id}`);
      await refetchTransactions();
    } catch (err) {
      error.value = err;
      console.error('거래 삭제 실패:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 전체 clear
  const clearTransactions = () => {
    transactions.value = [];
    currentUserId.value = null;
    lastQuery.value = {
      from: null,
      to: null,
    };
    error.value = null;
  };

  return {
    transactions,
    isLoading,
    error,
    currentUserId,
    lastQuery,
    hasTransactions,
    fetchTransactions,
    getTransactionsByMonth,
    getTransactionsByDuration,
    refetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
  };
});
