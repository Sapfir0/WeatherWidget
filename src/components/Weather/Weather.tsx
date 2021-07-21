import { IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { BsGear } from 'react-icons/bs';
import { TYPES } from '../../inversify/inversifyTypes';
import { useInject } from '../../services/hooks';
import { WeatherCard } from '../WeatherCard/WeatherCard';
import './Flipper.scss';
import { FlipStore } from './FlipStore';
import { Settings } from './Settings';
import './Weather.scss';
import { WeatherStore } from './WeatherStore';

export interface WeatherProps {}

export const Weather = observer((props: WeatherProps) => {
    const store = useInject<WeatherStore>(TYPES.WeatherStore);
    const flipStore = useInject<FlipStore>(TYPES.FlipStore);
    useEffect(() => {
        store.init();
    }, []);

    return (
        <div className="card">
            <div className={`flip-container ${flipStore.isFlipped ? 'active' : ''}`}>
                <div className="right-icon gear">
                    <IconButton onClick={flipStore.toogle}>
                        <BsGear className="settings" />
                    </IconButton>
                </div>
                <div className="flipper">
                    <div className="front">
                        {store.initialCity && <WeatherCard city={store.initialCity} />}
                        {!store.initialCity && store.cities?.map((c) => <WeatherCard key={c.id} city={c} />)}
                    </div>
                    <div className="back">
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    );
});
