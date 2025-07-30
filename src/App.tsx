import { useState } from "react";
import './App.css';

// APIから返ってくるデータの内使うものだけ定義

type WeatherData = {
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

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const handleSearch = async() => {
    if(!city) return;

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`;

    try {
      const response = await fetch(URL);
      const data: WeatherData = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.error("天気情報の取得に失敗しました:", error);
      setWeatherData(null);
    }
  };

  return (
    <div className="App">
      <h1>天気予報アプリ</h1>
      <div className="form">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Fukuoka,JP"
      />
      <button onClick={handleSearch}>検索</button>
      </div>
    {weatherData ? (
    <div className="weather-result">
      <h2>都市名:{weatherData.name}</h2>
      <p>天気：{weatherData.weather[0].main}</p>
      <p>気温:{weatherData?.main.temp} ℃</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
          alt="weather icon"
        />
      </div>
    ) : (
    <p>{/*ここが天気の結果表示エリア*/}都市名を入力して検索してください。</p>
    )}
    </div>
  );
}
export default App;