"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  end: number,
  options?: {
    start?: number;
    duration?: number;
    prefix?: string;
    enabled?: boolean;
  }
) {
  const {
    start = 0,
    duration = 2000,
    prefix = "",
    enabled = false,
  } = options ?? {};
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!enabled) return;

    const range = end - start;
    if (range === 0) {
      setValue(end);
      return;
    }

    const stepAmount = Math.max(1, Math.ceil(Math.abs(range) / 100));
    const stepTime =
      Math.abs(range) > 100 ? 1 : Math.abs(Math.floor(duration / range));

    let current = start;
    const timer = setInterval(() => {
      current += range > 0 ? stepAmount : -stepAmount;
      if ((range > 0 && current >= end) || (range < 0 && current <= end)) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [enabled, end, start, duration]);

  return `${prefix}${value.toLocaleString("pt-BR")}`;
}
