import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const monthlyTrans = ref([]);

  const getUserTransaction = async (id) => {
    try {
      const uri = 'http://localhost:3000/transactions';
      const response = await axios.get(`${uri}?userid=${id}`);

      if (response.status === 200) {
        // response.data를 배열 상태에 직접 할당합니다.
        monthlyTrans.value = response.data;
        console.log('데이터를 성공적으로 불러왔습니다:', monthlyTrans.value);
      }
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
    }
  };

  return { monthlyTrans, getUserTransaction };
});
