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

/**
 * @param {object} [options]
 * @param {Record<string, 'top' | 'bottom'>} [options.directions] 카드 type → 축
 * @param {'top' | 'bottom'} [options.defaultDirection='bottom']
 * @param {{ at: number, first: 'top' | 'bottom', second: 'top' | 'bottom' }} [options.gridSplit]
 *        `gridSplit`이 있으면 `cardEnterLeaveClass`에 **그리드 순서 index(0…)** 를 넘김. index < at → first, 아니면 second.
 */
export const useCardFadeAnimation = (cardOn, isFirstLoad, options = {}) => {
  const { directions = {}, defaultDirection = 'bottom', gridSplit } = options;

  const cardEnterLeaveClass = (typeOrIndex) => {
    const on = cardOn.value;
    const leaving = !on && !isFirstLoad.value;
    let axis;
    if (gridSplit && typeof typeOrIndex === 'number') {
      axis = typeOrIndex < gridSplit.at ? gridSplit.first : gridSplit.second;
    } else {
      axis = directions[typeOrIndex] ?? defaultDirection;
    }
    const pair = CARD_FADE_CLASS_BY_AXIS[axis] ?? CARD_FADE_CLASS_BY_AXIS.bottom;
    return {
      [pair.enter]: on,
      [pair.leave]: leaving,
    };
  };

  return { cardEnterLeaveClass };
};
