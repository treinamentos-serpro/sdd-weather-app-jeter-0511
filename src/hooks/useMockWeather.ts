import { useEffect, useRef, useState } from 'react';
import { mockWeatherData } from '../mocks/weather';

export type MockWeatherStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

export function useMockWeather(initialStatus: MockWeatherStatus = 'success') {
  const [status, setStatus] = useState(initialStatus);
  const [query, setQuery] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function search(city: string) {
    const trimmed = city.trim();
    if (!trimmed) return;
    if (timer.current !== null) clearTimeout(timer.current);
    setQuery(trimmed);
    setStatus('loading');
    timer.current = setTimeout(() => {
      const normalized = trimmed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      setStatus(normalized === 'sao paulo' ? 'success' : 'empty');
      timer.current = null;
    }, 500);
  }

  function retry() {
    search(query || mockWeatherData.city.name);
  }

  return { status, query, data: mockWeatherData, search, retry };
}
