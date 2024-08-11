import { useEffect, useState } from "react";
import "./App.css";
import Clear from "./images/Clear.jpg";
import Clouds from "./images/Clouds.jpg";
import Rain from "./images/Rain.jpg";
import Snowy from "./images/Snowy.jpg";
import Thunder from "./images/Thunder.jpg";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");

  const fetchWeatherData = async (lat, lon, cityName) => {
    let ApiKey = "a11c88756aec36ee894ac9495fe9747a";
    let url;

    if (cityName) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
      console.log(result);
    } catch (error) {
      console.log("Error fetching data:", error.message);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location");
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setCityName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    fetchWeatherData(null, null, cityName);
  };

  const getBackgroundImage = () => {
    if (!data || !data.weather) return `url(${Clear})`;
    switch (data.weather[0].main) {
      case "Clear":
        return `url(${Clear})`;
      case "Rain":
        return `url(${Rain})`;
      case "Clouds":
        return `url(${Clouds})`;
      case "Snow":
        return `url(${Snowy})`;
      case "Thunder":
        return `url(${Thunder})`;
      default:
        return `url(${Clear})`;
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);
  return (
    <div
      className="App"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cityName}
          onChange={handleInputChange}
          placeholder="Enter city name"
        ></input>
        <button type="submit">Get Weather info</button>
      </form>
      <div className="weatherWrapper">
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="infoSection">
            <p style={{ fontSize: "40px" }}>{data.name}</p>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <p>
                Current temp <br /> {(data.main.temp - 273.15).toFixed(2)}°C
              </p>
              <p>
                Feels like <br />
                {(data.main.feels_like - 273.15).toFixed(2)}°C
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div style={{ display: "flex" }}>
                <p>↓</p>
                <p>
                  Low <br /> {(data.main.temp_min - 273.15).toFixed(2)}°C
                </p>
              </div>
              <div style={{ display: "flex" }}>
                <p>↑</p>

                <p>
                  High <br />
                  {(data.main.temp_max - 273.15).toFixed(2)}°C
                </p>
              </div>
            </div>
            <br />
            {/* <p>{data.weather[0].main}</p> */}
            <p>{data.weather[0].description}</p>
          </div>
        ) : (
          <p> Enter a city name to get weather info</p>
        )}
      </div>
    </div>
  );
}

export default App;
