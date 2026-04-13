import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useTransactionsStore } from './transactions';
import { useUserStore } from './user';
import { today, getLocalTimeZone } from '@internationalized/date';

export const useDurationStore = defineStore('duration', () => {
  const transactionsStore = useTransactionsStore();
  const userStore = useUserStore();

  const date = ref(today(getLocalTimeZone()));
  const duration = ref('day'); // 'month', 'week', 'day'

  const user = computed(() => userStore.user);

  // 날짜 포맷팅 헬퍼 함수
  const formatDate = (dateObj, isEnd = false) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');

    return isEnd ? `${y}-${m}-${d}T23:59:59` : `${y}-${m}-${d}T00:00:00`;
  };

  const filteredTrans = computed(() => transactionsStore.getTransactionsByDuration());

  const monthlyTrans = computed(() => {
    const current = date.value.toDate(getLocalTimeZone());
    return transactionsStore.getTransactionsByMonth(current.getFullYear(), current.getMonth());
  });

  const durationTrans = computed(() => {
    const result = { income: [], expense: [] };
    filteredTrans.value.forEach((t) => {
      if (t.type === 'income') result.income.push(t);
      else if (t.type === 'expense') result.expense.push(t);
    });
    return result;
  });

  const dateTransactionNumber = computed(() => {
    const data = {};
    monthlyTrans.value.forEach((t) => {
      if (!t.date) return;

      // 날짜 키 생성 (YYYY-MM-DD)
      const dateStr =
        typeof t.date === 'string'
          ? t.date.split('T')[0]
          : `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}-${String(t.date.getDate()).padStart(2, '0')}`;

      if (!data[dateStr]) {
        data[dateStr] = [0, 0]; // [수입 횟수, 지출 횟수]
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
    const current = date.value.toDate(getLocalTimeZone());
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    let start, end;

    if (duration.value === 'month') {
      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
    } else if (duration.value === 'week') {
      const dayOfWeek = current.getDay();
      const diffToStart = day - dayOfWeek;
      start = new Date(year, month, diffToStart);
      end = new Date(year, month, diffToStart + 6);
    } else {
      start = new Date(year, month, day);
      end = new Date(year, month, day);
    }

    return {
      startDate: formatDate(start, false),
      endDate: formatDate(end, true),
    };
  });

  const dateFormat = computed(() => {
    const cal = date.value;
    return {
      year: cal.year,
      month: cal.month,
      day: cal.day,
    };
  });

  /** BarChart 등에 쓰는 기간 요약 문구 (month / day / week) */
  const durationSummary = computed(() => {
    if (duration.value === 'month') {
      return `${dateFormat.value.year}년 ${dateFormat.value.month}월 핵심 요약`;
    }
    if (duration.value === 'day') {
      return `${dateFormat.value.year}년 ${dateFormat.value.month}월 ${dateFormat.value.day}일 핵심 요약`;
    }
    const end = date.value.toDate(getLocalTimeZone());
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const sm = start.getMonth() + 1;
    const sd = start.getDate();
    const em = end.getMonth() + 1;
    const ed = end.getDate();
    if (sm === em) {
      return `${sm}월 ${sd}일 ~ ${ed}일 핵심 요약`;
    }
    return `${sm}월 ${sd}일 ~ ${em}월 ${ed}일 핵심 요약`;
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

  const handleDurationChange = (selectedValue) => {
    duration.value = selectedValue;
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    date.value = newDate;
  };

  watch(
    () => user.value?.userid,
    (userId) => {
      if (userId) {
        transactionsStore.fetchTransactions(userId);
      }
    },
    { immediate: true }
  );

  watch(
    () => dateRange.value,
    (newRange) => {
      transactionsStore.lastQuery.from = newRange.startDate;
      transactionsStore.lastQuery.to = newRange.endDate;
    },
    { immediate: true, deep: true }
  );

  const isLoading = computed(() => transactionsStore.isLoading);

  return {
    date,
    duration,
    dateFormat,
    durationSummary,
    filteredTrans,
    monthlyTrans,
    durationTrans,
    totalExpense,
    totalIncome,
    netProfit,
    dateTransactionNumber,
    dateRange,
    handleDurationChange,
    handleDateChange,
    transactionsStore,
    isLoading,
  };
});
