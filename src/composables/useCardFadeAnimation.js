export const CARD_FADE_TOP_DOWN_TYPES = new Set(['user', 'activity', 'dashboard']);

export const useCardFadeAnimation = (cardOn, isFirstLoad) => {
  const cardEnterLeaveClass = (type) => {
    const on = cardOn.value;
    const leaving = !on && !isFirstLoad.value;
    if (CARD_FADE_TOP_DOWN_TYPES.has(type)) {
      return {
        'fade-in-items-from-top': on,
        'fade-out-items-to-top': leaving,
      };
    }
    return {
      'fade-in-items-from-bottom': on,
      'fade-out-items-to-bottom': leaving,
    };
  };

  return { cardEnterLeaveClass };
};
