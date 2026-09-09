import { useCallback, useRef } from "react";

const LONG_PRESS_MS = 500;

type LongPressSelectHandlers = {
  onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
  onTouchCancel: () => void;
};

const selectElementContents = (element: HTMLElement): void => {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
};

/** Selects all text in a touched element after a long press (for mobile copy). */
export const useLongPressSelect = (): LongPressSelectHandlers => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      cancel();
      const element = event.currentTarget;

      timerRef.current = setTimeout(() => {
        selectElementContents(element);
        timerRef.current = undefined;
      }, LONG_PRESS_MS);
    },
    [cancel],
  );

  const onTouchEnd = useCallback(() => {
    cancel();
  }, [cancel]);

  const onTouchMove = useCallback(() => {
    cancel();
  }, [cancel]);

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel: onTouchEnd,
  };
};
