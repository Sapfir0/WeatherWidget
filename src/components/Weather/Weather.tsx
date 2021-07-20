import React, { useState } from 'react';
import { BsGear } from 'react-icons/bs';
import { TYPES } from '../../inversify/inversifyTypes';
import { useInject } from '../../services/hooks';
import { WeatherCard } from '../WeatherCard/WeatherCard';
import './Flipper.scss';
import { Settings } from './Settings';
import './Weather.scss';
import { WeatherStore } from './WeatherStore';

export interface WeatherProps {}

export const Weather = (props: WeatherProps) => {
    const store = useInject<WeatherStore>(TYPES.WeatherStore);
    const [flipper, setFlip] = useState(false);

    return (
        <div>
            <BsGear className="settings" onClick={() => setFlip(!flipper)} />
            <div className={`flip-container ${flipper ? 'active' : ''}`}>
                <div className="flipper">
                    <div className="front">
                        {store.getCachedCities()?.map((c) => (
                            <WeatherCard city={c} />
                        ))}
                    </div>
                    <div className="back">
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    );
};
