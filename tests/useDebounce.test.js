import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../src/index.js';

function setup(initialValue, delay = 300) {
  return renderHook(({ value }) => useDebounce(value, delay), {
    initialProps: { value: initialValue },
  });
}

function advance(ms) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = setup('a');

    expect(result.current).toBe('a');
  });

  it('does not update before the delay has elapsed', () => {
    const { result, rerender } = setup('a');

    rerender({ value: 'b' });
    advance(299);

    expect(result.current).toBe('a');
  });

  it('updates once the delay has elapsed', () => {
    const { result, rerender } = setup('a');

    rerender({ value: 'b' });
    advance(300);

    expect(result.current).toBe('b');
  });

  it('restarts the delay when the value changes again', () => {
    const { result, rerender } = setup('a');

    rerender({ value: 'b' });
    advance(200);
    rerender({ value: 'c' });

    expect(vi.getTimerCount()).toBe(1);

    advance(299);
    expect(result.current).toBe('a');

    advance(1);
    expect(result.current).toBe('c');
  });

  it('clears the pending timer on unmount', () => {
    const { rerender, unmount } = setup('a');

    rerender({ value: 'b' });
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps function values as-is', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = setup(first);

    rerender({ value: second });
    advance(300);

    expect(result.current).toBe(second);
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });
});
