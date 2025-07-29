import { useState } from "react";
import './App.css';

function App() {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    //STEP3で実装
    console.log('Searching for:', city);
  };

  return (
    <div className="APP">
      <h1>天気予報アプリ</h1>
      <div className="form">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="福岡"
      />
      <button onClick={handleSearch}>検索</button>    
    </div>
    /*↓ここに天気の結果が表示される*/
    <div className="weather-result">
      <h2>福岡</h2>
      <p>天気：</p>
      <p>気温: ℃</p>
    </div>
      /*↑ここまでが天気の結果表示エリア*/
  </div>
  );
}

export default App;