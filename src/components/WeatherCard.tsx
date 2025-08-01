// src/components/WeatherCard.tsx
import { type WeatherData } from '../App';

type WeatherCardProps = {
  weatherData: WeatherData;
  onAddFavorite?: () => void;
  onRemoveFavorite?: ()=> void;
  isFavorite: boolean;
};

export const WeatherCard = ({ weatherData, onAddFavorite, onRemoveFavorite, isFavorite }:
    WeatherCardProps) => {
    return (
        <div className="weather-card">
            <h2>{weatherData.name}</h2>
            <p>天気: {weatherData.weather[0].main}</p>
            <p>気温: {weatherData.main.temp}℃</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
        alt="weather icon"
      />
      {isFavorite ? (
        <button onClick={onRemoveFavorite}>お気に入りから削除</button>
      ) : (
      onAddFavorite && <button onClick={onAddFavorite}>お気に入りに追加</button>
          )}
        </div>
    );
};