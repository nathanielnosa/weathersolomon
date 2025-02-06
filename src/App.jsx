import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/navbar/Navbar';
import { BsGeoAlt, BsClock } from 'react-icons/bs';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'd56184b6799ece2242ea37c7a46a0381';

  // Format Unix timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get geolocation
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            setLocation(userLocation);
          },
          (error) => {
            setError('Please enable location access for accurate weather data');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch weather data: ' + error.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Component for current weather
  const CurrentWeather = ({ weather }) => (
    <div className="card shadow">
      <div className="card-body text-center">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <BsGeoAlt className="me-2" size={24} />
          <h2 className="mb-0">Current Weather</h2>
        </div>
        {weather?.weather?.[0]?.icon && (
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="weather"
            className="weather-icon"
          />
        )}
        <div className="display-2 fw-bold my-3">
          {weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C
        </div>
        <div className="h4 text-capitalize">
          {weather?.weather?.[0]?.description || 'Loading...'}
        </div>
        <div className="mt-3">
          <p className="mb-1">Humidity: {weather?.main?.humidity}%</p>
          <p className="mb-1">Wind Speed: {weather?.wind?.speed} m/s</p>
        </div>
      </div>
    </div>
  );

  // Component for hourly forecast
  const HourlyForecast = ({ hourly }) => (
    <div className="card shadow">
      <div className="card-body">
        <h5 className="d-flex align-items-center mb-4">
          <BsClock className="me-2" size={20} />
          24-Hour Forecast
        </h5>
        <div className="hourly-scroll">
          {hourly?.slice(0, 24).map((hour, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted">{formatTime(hour.dt)}</div>
              <img
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt="weather"
                width="40"
              />
              <div className="fw-bold">{Math.round(hour.temp)}°C</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Component for weekly forecast
  const WeeklyForecast = ({ daily }) => {
    const formatDay = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
      <div className="card shadow mt-4">
        <div className="card-body">
          <h5 className='py-2'>7-Day Forecast</h5>
          <div className="row g-4">
            {daily?.slice(0, 7).map((day, i) => (
              <div key={i} className="col-md-3 text-center">
                <div className="text-muted">{formatDay(day.dt)}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="weather"
                  width="50"
                  className="my-2"
                />
                <div className="fw-bold">{Math.round(day.temp.day)}°C</div>
                <div className="text-muted small">{Math.round(day.temp.night)}°C</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container py-4">
        {error && (
          <div className="alert alert-danger alert-dismissible">
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            <strong>{error}!</strong>
          </div>
        )}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Detecting your location...</p>
          </div>
        ) : (
          weatherData && (
            <>
              <div className="row g-4">
                <div className="col-md-8">
                  <CurrentWeather weather={weatherData} />
                </div>
                <div className="col-md-4">
                  <HourlyForecast hourly={weatherData.hourly} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <WeeklyForecast daily={weatherData.daily} />
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default App;