import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useTransactionsStore } from './transactions';
import { useUserStore } from './user';
import { today, getLocalTimeZone } from '@internationalized/date';

export const useDurationStore = defineStore('duration', () => {
  const transactionsStore = useTransactionsStore();
  const userStore = useUserStore();

  const date = ref(today(getLocalTimeZone()));
  const duration = ref('month'); // 'month', 'week', 'day'

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

  const handleDurationChange = (selectedValue) => {
    duration.value = selectedValue;
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

  return {
    date,
    duration,
    filteredTrans,
    monthlyTrans,
    durationTrans,
    dateTransactionNumber,
    dateRange,
    handleDurationChange, // 💡 컴포넌트에서 쓸 수 있도록 내보내기 추가
  };
});
