// src/components/WeatherCard.tsx
import { type WeatherData } from '../App';

type WeatherCardProps = {
  weatherData: WeatherData;
  onAddFavorite: () => void;
  isFavorite: boolean;
};

export const WeatherCard = ({ weatherData, onAddFavorite, isFavorite }:
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
        <p className="favorite-status">お気に入り登録済み</p>
      ) : (
      <button onClick={onAddFavorite}>お気に入りに追加</button>
          )}
        </div>
    );
};