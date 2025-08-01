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

  const [dashboardData,setDashboardData] = useState<WeatherData[]>([]);

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

  const fetchALLFavoritesWeather = async () => {
    setError(null);
    try {
      const weatherPromises = favorites.map(city => {
        const URL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`;
        return fetch(URL).then(res => {
          if(!res.ok) {
            throw new Error(`Faild to fetch weather for ${city}`);
          }
          return res.json();
        });
      });
      const weatherResults = await Promise.all(weatherPromises);
      setDashboardData(weatherResults);
    } catch (error){
      console.error("Failed to fetch favorites weather data", error);
      setError("お気に入り都市の天気取得中にエラーが発生しました。");
      setDashboardData([]);
    }
  };

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if(favorites.length > 0) {
      fetchALLFavoritesWeather();
    } else {
      setDashboardData([]);
    }
  },[favorites]);

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

      <div className="dashboard">
        <h3>お気に入りダッシュボード</h3>
        {dashboardData.length > 0 ? (
          <div className="dashboard-grid">
            {dashboardData.map(data => (
              <WeatherCard
                key={data.name}
                weatherData={data}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <p>お気に入りを登録すると、ここに一覧表示されます。</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className="search-result-area">
          <h3>検索結果</h3>
        <WeatherCard
          weatherData={weatherData}
          onAddFavorite={handleAddToFavorites}
          isFavorite={favorites.includes(weatherData.name)}
          onRemoveFavorite = {() => {handleRemoveFavorites(weatherData.name)}}
        />
      </div>
    )}
    </div>
  );
}
export default App;