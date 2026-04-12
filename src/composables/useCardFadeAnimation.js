/** `card-fade.css`의 `.fade-out-items-*` duration(0.6s)과 동일하게 유지 */
export const CARD_FADE_LEAVE_MS = 500;

/** `card-fade.css` 등장(enter)·퇴장(leave) 클래스 — 템플릿에서 직접 바인딩할 때 사용 */
export const CARD_FADE_CLASS_BY_AXIS = Object.freeze({
  top: Object.freeze({
    enter: 'fade-in-items-from-top',
    leave: 'fade-out-items-to-top',
  }),
  bottom: Object.freeze({
    enter: 'fade-in-items-from-bottom',
    leave: 'fade-out-items-to-bottom',
  }),
});

export const useCardFadeAnimation = (cardOn, isFirstLoad, options = {}) => {
  const { directions = {}, defaultDirection = 'bottom' } = options;

  const cardEnterLeaveClass = (type) => {
    const on = cardOn.value;
    const leaving = !on && !isFirstLoad.value;
    const axis = directions[type] ?? defaultDirection;
    const pair = CARD_FADE_CLASS_BY_AXIS[axis] ?? CARD_FADE_CLASS_BY_AXIS.bottom;
    return {
      [pair.enter]: on,
      [pair.leave]: leaving,
    };
  };

  return { cardEnterLeaveClass };
};
