// sec/App.tsx
import { useEffect, useState } from "react";
import './App.css';
import { WeatherCard } from './components/WeatherCard';
import { useDebounce } from "./hooks/useDebounce";

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

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(city, 800);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const GEODB_API_KEY = import.meta.env.VITE_GEODB_API_KEY;

  const fetchSuggestions = async (inputValue: string) => {
    if(inputValue.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSuggestionsLoading(true);
  const baseUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  const params = new URLSearchParams({
    countryIds: 'JP',
    namePrefix: inputValue,
    languageCodo: 'ja',
  });

  const URL = `${baseUrl}?${params.toString()}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': GEODB_API_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(URL,options);
      if(!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    const result = await response.json();
    const cityNames = result.data?.map((item: any) => item.city)|| [];
    setSuggestions(cityNames);
  } catch(error) {
    console.error("Faild to fetch suggestions", error);
    setSuggestions([]);
  } finally {
    setIsSuggestionsLoading(false);
  }
  };

  const handleSearch = async(searchCity: string) => {
    if(!searchCity) return;
    setSuggestions([]);
    setError(null);

    try {
      const encodedSearchCity = encodeURIComponent(searchCity);
      const geocodingUrl =
     `https://api.openweathermap.org/geo/1.0/direct?q=${encodedSearchCity},JP&limit=5&appid=${API_KEY}`;
      const geoResponse = await fetch(geocodingUrl);
      if(!geoResponse.ok) {
        throw new Error ('Geocoding API request failed');
      }
      
      const geoDataArray = await geoResponse.json();
      if(geoDataArray.length === 0) {
        throw new Error('都市が見つかりませんでした');
      }

      const stateCounts: { [key: string]: number } = {};
      geoDataArray.forEach((item: any) => {
        if(item.state){
          stateCounts[item.state] = (stateCounts[item.state] || 0) + 1;
        }
      });
      
      let bestState = '';
      let maxCount = 0;
      for (const state in stateCounts) {
        if(stateCounts[state] > maxCount){
          maxCount = stateCounts[state];
          bestState = state;
        }
      }

      const bestMach = geoDataArray.find((item: any) => item.state === bestState) || geoDataArray[0];

      const { lat, lon } = bestMach;

      const weatherUrl = 
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;
      
      const weatherResponse = await fetch(weatherUrl);
      if(!weatherResponse.ok) {
        throw new Error('Weather fetch failed');
      }
      
      const data: WeatherData = await weatherResponse.json();

      const displayData = { ...data, name: searchCity};
      setWeatherData(displayData);

    } catch(error) {
      console.error("天気情報の取得に失敗しました:", error);
    setError("都市が見つかりませんでした。「~市」「~区」などは含めず、都市名（例：東京、Fukuoka）で入力してください。");
    setWeatherData(null);
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

  useEffect(() => {
    if(debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);



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

      {isSuggestionsLoading ? (
        <div className="suggestions-list">Loading...</div>
      ) : (
        suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion)=> (
              <li
              key={suggestion}
              onClick={async () => {
                setSuggestions([]);
                await handleSearch(suggestion);
                setCity(suggestion);
              }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        ) 
      )}

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