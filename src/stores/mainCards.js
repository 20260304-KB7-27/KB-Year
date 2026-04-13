import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const MAIN_CARDS_STORAGE_KEY = 'kb-year-main-cards-order';

/** 메인 그리드 카드 정의 (id·type 고정) */
export const DEFAULT_MAIN_CARDS = [
  { id: 1, type: 'user' },
  { id: 2, type: 'activity' },
  { id: 3, type: 'dashboard' },
  { id: 4, type: 'calendar' },
  { id: 5, type: 'bar' },
  { id: 6, type: 'line' },
];

function parseSavedOrder() {
  try {
    const raw = localStorage.getItem(MAIN_CARDS_STORAGE_KEY);
    if (!raw) return null;
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids) || ids.length !== DEFAULT_MAIN_CARDS.length) return null;
    const validIds = new Set(DEFAULT_MAIN_CARDS.map((c) => c.id));
    if (!ids.every((id) => validIds.has(id)) || new Set(ids).size !== ids.length) return null;
    return ids.map((id) => DEFAULT_MAIN_CARDS.find((c) => c.id === id));
  } catch {
    return null;
  }
}

export const useMainCardsStore = defineStore('mainCards', () => {
  const cards = ref(parseSavedOrder() ?? [...DEFAULT_MAIN_CARDS]);

  watch(
    cards,
    (val) => {
      localStorage.setItem(MAIN_CARDS_STORAGE_KEY, JSON.stringify(val.map((c) => c.id)));
    },
    { deep: true }
  );

  const resetCards = () => {
    cards.value = [...DEFAULT_MAIN_CARDS];
    localStorage.removeItem(MAIN_CARDS_STORAGE_KEY);
  };

  return {
    cards,
    resetCards,
  };
});
