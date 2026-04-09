import { ref, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export const useTransactionCal = () => {
  const store = useTransactionsStore();
  const { transactions } = storeToRefs(store); // store 저장 거래내역

  const currentUserId = ref(useUserStore().user.userid);
  const monthlyTrans = storeToRefs(store.getTransactionsByMonth()); // 해당 달의 거래내역 getTransactionsByMonth(연도, 선택한 달)

  const durationTrans = ref({
    expense: [],
    income: [],
  });

  // getDurationTransaction 사용 코드에서 가져오고 싶은 연도와 일자를 주는 걸로 바꿔야함.
  const getDurationTransaction = (year, month) => {
    try {
      const data = store.getTransactionsByMonth(year, month);

      if (data) {
        durationTrans.value.income = data.filter((t) => t.type === 'income');
        durationTrans.value.expense = data.filter((t) => t.type === 'expense');
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    }
  };

  const totalIncome = computed(() => {
    return monthlyTrans
      .filter((t) => t.type?.toUpperCase() === 'INCOME')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  const totalExpense = computed(() => {
    return monthlyTrans.value
      .filter((t) => t.type?.toUpperCase() === 'EXPENSE')
      .reduce((acc, cur) => acc + Number(cur.amount), 0);
  });

  // todo: refactoring
  //   const netProfit = computed(() => totalIncome.value - totalExpense.value);

  //   function setMonth(date) {
  //     selectedDate.value = date;
  //   }

  //   const fetchTransactions = async (userId) => {
  //     if (!userId) return;

  //     isLoading.value = true;
  //     const { from, to } = dateRange.value;

  //     try {
  //       const response = await axios.get(url, {
  //         params: {
  //           userid: userId,
  //           date_gte: from,
  //           date_lte: to,
  //           _sort: 'date',
  //           _order: 'desc',
  //         },
  //       });
  //       monthlyTrans.value = response.data;
  //     } catch (err) {
  //       console.error('Data Fetch Error:', err);
  //     } finally {
  //       isLoading.value = false;
  //     }
  //   };

  //   const changeMonth = async (offset, userId) => {
  //     const newDate = new Date(selectedDate.value);
  //     newDate.setMonth(newDate.getMonth() + offset);
  //     selectedDate.value = newDate;

  //     await fetchTransactions(userId);
  //   };
};
