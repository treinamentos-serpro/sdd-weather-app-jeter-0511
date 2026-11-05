import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brasil',
  admin1: 'São Paulo',
  latitude: -23.5505,
  longitude: -46.6333,
};

const current: CurrentWeatherData = {
  temperature: 24,
  weatherCode: 2,
  humidity: 62,
  windSpeed: 12,
  pressure: 1012,
  precipitation: 0.4,
  time: '2026-11-05T12:00',
};

describe('CurrentWeather', () => {
  it('apresenta hero, condição e métricas em Celsius', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    const region = screen.getByRole('region', { name: 'Clima atual' });
    expect(within(region).getByText('São Paulo')).toBeInTheDocument();
    expect(within(region).getByText('24°')).toBeInTheDocument();
    expect(within(region).getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(within(region).getByText('62%')).toBeInTheDocument();
    expect(within(region).getByText('12 km/h')).toBeInTheDocument();
    expect(within(region).getByText('0.4 mm')).toBeInTheDocument();
    expect(within(region).getByText('1012 hPa')).toBeInTheDocument();
  });

  it('converte a temperatura para Fahrenheit', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByText('75°')).toBeInTheDocument();
  });
});