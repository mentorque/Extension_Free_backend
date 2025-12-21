import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'dailyActionTracker';

const getTodayLocal = () => {
  try {
    // en-CA yields YYYY-MM-DD in most browsers
    return new Date().toLocaleDateString('en-CA');
  } catch {
    // Fallback to ISO split (could be UTC-shifted)
    return new Date().toISOString().slice(0, 10);
  }
};

const readTracker = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeTracker = (tracker) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
  } catch {
    // ignore
  }
};

const initializeTracker = () => {
  const today = getTodayLocal();
  const stored = readTracker();
  if (!stored || stored.date !== today) {
    const fresh = { date: today, count: 0 };
    writeTracker(fresh);
    return fresh;
  }
  return stored;
};

const useDailyLimit = (limit = 20) => {
  const [tracker, setTracker] = useState(() => initializeTracker());

  // Ensure reset at start of session/day change
  useEffect(() => {
    const current = initializeTracker();
    if (current.date !== tracker.date || current.count !== tracker.count) {
      setTracker(current);
    }
    // Also sync on visibility change (e.g., another tab updated it)
    const onVisibility = () => {
      const latest = initializeTracker();
      setTracker(latest);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canConsume = tracker.count < limit;
  const remaining = Math.max(0, limit - tracker.count);
  const isExceeded = !canConsume;

  const consume = useCallback(() => {
    const today = getTodayLocal();
    const current = readTracker() || { date: today, count: 0 };
    const normalized = current.date === today ? current : { date: today, count: 0 };
    if (normalized.count >= limit) {
      return false;
    }
    const updated = { date: today, count: normalized.count + 1 };
    writeTracker(updated);
    setTracker(updated);
    return true;
  }, [limit]);

  return { count: tracker.count, limit, remaining, canConsume, isExceeded, consume };
};

export default useDailyLimit;


