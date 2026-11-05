import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

/** Card de um dia da previsão. */
export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const temperatureUnit = unit === 'celsius' ? 'C' : 'F';

  return (
    <li className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
      <p className="font-semibold">{getDayLabel(day.date, index)}</p>
      <p className="text-xs text-white/80">{getShortDate(day.date)}</p>
      <span role="img" aria-label={getWeatherLabel(day.weatherCode)} className="text-3xl">
        {getWeatherIcon(day.weatherCode)}
      </span>
      <div className="flex flex-wrap justify-center gap-x-2 text-sm">
        <span className="font-semibold">
          Máx {formatTemperature(day.max, unit)}
          {temperatureUnit}
        </span>
        <span className="text-white/60">
          Mín {formatTemperature(day.min, unit)}
          {temperatureUnit}
        </span>
      </div>
      <p className="text-xs text-accent-400">
        <span aria-hidden="true">💧 </span>
        <span>Chuva </span>
        <span>{day.precipitationProbability}%</span>
      </p>
    </li>
  );
}
