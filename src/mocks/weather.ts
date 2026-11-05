import type { WeatherData } from '../types/weather';

export const mockWeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brasil',
    admin1: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  current: {
    temperature: 24,
    weatherCode: 2,
    humidity: 62,
    windSpeed: 12,
    pressure: 1012,
    precipitation: 0,
    time: '2026-11-05T12:00',
  },
  forecast: [
    {
      date: '2026-11-05',
      min: 18,
      max: 28,
      weatherCode: 2,
      precipitationProbability: 10,
    },
    {
      date: '2026-11-06',
      min: 17,
      max: 26,
      weatherCode: 3,
      precipitationProbability: 20,
    },
    {
      date: '2026-11-07',
      min: 16,
      max: 22,
      weatherCode: 61,
      precipitationProbability: 80,
    },
    {
      date: '2026-11-08',
      min: 16,
      max: 25,
      weatherCode: 3,
      precipitationProbability: 30,
    },
    {
      date: '2026-11-09',
      min: 17,
      max: 27,
      weatherCode: 1,
      precipitationProbability: 5,
    },
  ],
} satisfies WeatherData;