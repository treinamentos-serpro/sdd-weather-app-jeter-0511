import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import type { ForecastDay, Unit } from '../../src/types/weather';

const forecast: ForecastDay[] = [
  { date: '2026-11-05', min: 16, max: 24, weatherCode: 2, precipitationProbability: 30 },
  { date: '2026-11-06', min: 17, max: 26, weatherCode: 3, precipitationProbability: 20 },
  { date: '2026-11-07', min: 15, max: 22, weatherCode: 61, precipitationProbability: 80 },
  { date: '2026-11-08', min: 14, max: 23, weatherCode: 1, precipitationProbability: 10 },
  { date: '2026-11-09', min: 18, max: 28, weatherCode: 0, precipitationProbability: 5 },
];

describe('ForecastList', () => {
  it('exibe cinco dias, rótulos, ícones, máximas, mínimas e probabilidade de chuva', () => {
    render(<ForecastList forecast={forecast} unit="celsius" />);

    const region = screen.getByRole('region', { name: 'Previsão de 5 dias' });
    const days = within(region).getAllByRole('listitem');

    expect(days).toHaveLength(5);
    expect(within(days[0]!).getByText('Hoje')).toBeInTheDocument();
    expect(within(days[1]!).getByText('Amanhã')).toBeInTheDocument();
    expect(within(days[0]!).getByRole('img', { name: 'Parcialmente nublado' })).toBeInTheDocument();
    expect(within(days[0]!).getByText('Máx 24°C')).toBeInTheDocument();
    expect(within(days[0]!).getByText('Mín 16°C')).toBeInTheDocument();
    expect(within(days[0]!).getByText('Chuva')).toBeInTheDocument();
    expect(within(days[0]!).getByText('30%')).toBeInTheDocument();
  });

  it('converte máximas e mínimas para a unidade selecionada', () => {
    const unit: Unit = 'fahrenheit';
    render(<ForecastList forecast={forecast} unit={unit} />);

    const region = screen.getByRole('region', { name: 'Previsão de 5 dias' });
    const today = within(within(region).getAllByRole('listitem')[0]!);
    expect(today.getByText('Máx 75°F')).toBeInTheDocument();
    expect(today.getByText('Mín 61°F')).toBeInTheDocument();
  });
});