// src/hooks/use-debounce.test.ts
import { useDebounce } from "@/hooks/use-debounce";
import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("updates value after specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "hello", delay: 500 },
      }
    );

    // initial value is immediate
    expect(result.current).toBe("hello");

    // change value
    rerender({ value: "world", delay: 500 });
    // before timeout, still old
    expect(result.current).toBe("hello");

    // advance time and expect new value
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("world");
  });
});
