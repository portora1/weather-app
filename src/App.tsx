// sec/App.tsx
import { useEffect, useState } from "react";
import './App.css';
import { WeatherCard } from './components/WeatherCard';

export type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    icon: string;
  }[];
};

function App() {
  const [city, setCity] = useState('');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saveFavorites = localStorage.getItem('weatherFavorites');
    return saveFavorites ? JSON.parse(saveFavorites) : [];
  });

  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const handleSearch = async(searchCity: string) => {
    if(!searchCity) return;
    setError(null);
    setWeatherData(null);

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric&lang=ja`;

    try {
      const response = await fetch(URL);
      if(!response.ok) {
      throw new Error ('都市が見つかりませんでした');
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.error("天気情報の取得に失敗しました:", error);
      setError("都市が見つかりませんでした。入力内容を確認して再度お試しください。");
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(city);
  };

    const handleAddToFavorites = () => {
    if (!weatherData) return;
    if(!favorites.includes(weatherData.name)) {
      setFavorites([...favorites, weatherData.name]);
    }
  };

  const handleRemoveFavorites = (cityToRemove:string) => {
    setFavorites(favorites.filter(city => city !== cityToRemove));
  };

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="App">
      <h1>天気予報アプリ</h1>
      <form className="form" onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="都市名を入力してください"
      />
      <button type="submit">検索</button>
      </form>
      <div className="favolites-list">
        <h3>お気に入りリスト</h3>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map((favCity) => (
              <li key={favCity}>
                <span className="favorite-city" onClick={() => handleSearch(favCity)}>
                  {favCity}
                </span>
                <button onClick={() => handleRemoveFavorites(favCity)}>削除</button>
              </li>
            ))}
          </ul>
            ) : (
              <p>お気に入りの都市はありません。</p>
            )}
      </div>
      {error && <p className="error-message">{error}</p>}
    {weatherData ? (
      <WeatherCard
        weatherData={weatherData}
        onAddFavorite={handleAddToFavorites}
        isFavorite={favorites.includes(weatherData.name)}
      />
    ) : (
    <p>{/*ここが天気の結果表示エリア*/}都市名を入力して検索してください。</p>
    )}
    </div>
  );
}
export default App;