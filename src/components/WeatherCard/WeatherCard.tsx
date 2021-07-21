import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { RiFlaskFill } from 'react-icons/ri';
import { TYPES } from '../../inversify/inversifyTypes';
import { useInject } from '../../services/hooks';
import { degToCompass } from '../../services/utils';
import { City } from '../../typings/OWM';
import { WeatherCardStore } from './WeatherCardStore';

export interface WeatherCardProps {
    city: City;
}

export const WeatherCard = observer((props: WeatherCardProps) => {
    const store = useInject<WeatherCardStore>(TYPES.WeatherCardStore);
    useEffect(() => {
        store.getWeather(props.city.name);
    }, []);

    const { weatherData } = store;
    const currentWeather = weatherData?.weather[0];

    const standardDegree = '-45deg'; // для того, чтобы стрелка смотрела наверх
    return (
        <div className="card">
            <div className="card__header">
                {props.city.name}, {props.city.country}
            </div>
            {store.weatherData && (
                <>
                    <div className="card__temp-line">
                        <img src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}></img>
                        <div className="temperature">{weatherData.main.temp}°C</div>
                    </div>
                    <div className="description">
                        Feels like {weatherData.main.feels_like}°C. {currentWeather.description}
                    </div>
                    <div className="card__pressure-wind">
                        <div className="wind">
                            <FaLocationArrow
                                style={{
                                    transform: `rotate(calc(${standardDegree} - ${weatherData.wind.deg}deg))`,
                                    marginRight: '5px',
                                }}
                            />
                            {weatherData.wind.speed}m/s {degToCompass(weatherData.wind.deg)}
                        </div>
                        <div className="pressure">
                            <RiFlaskFill /> {weatherData.main.pressure}hPa
                        </div>
                    </div>
                    <div className="humidity">Humidity: {weatherData.main.humidity}%</div>
                    <div className="visibility">Visibility: {weatherData.visibility / 1000}km</div>
                </>
            )}
        </div>
    );
});
