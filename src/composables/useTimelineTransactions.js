import { computed } from 'vue';
import { isSameDate } from '@/utils/date';

export const useTimelineTransactions = (data) => {
  const transactions = computed(() => {
    const sorted = [...data.value].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) return [];

    const today = new Date();

    const todayList = sorted.filter((item) => isSameDate(new Date(item.date), today));

    if (todayList.length > 0) {
      return todayList.slice(0, 10);
    }

    const latestDate = new Date(sorted[0].date);

    const latestDateList = sorted.filter((item) => isSameDate(new Date(item.date), latestDate));

    return latestDateList.slice(0, 10);
  });

  return { transactions };
};
