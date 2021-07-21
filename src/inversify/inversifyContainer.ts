import { Container } from 'inversify';
import 'reflect-metadata';
import { FlipStore } from '../components/Weather/FlipStore';
import { WeatherStore } from '../components/Weather/WeatherStore';
import { WeatherCardStore } from '../components/WeatherCard/WeatherCardStore';
import ApiInteractionService from '../services/ApiInteractionService';
import { OpenWeatherMapInteractionService } from '../services/apiServices/OpenWeatherMapInteractionService';
import BaseApiInteractionService from '../services/BaseApiInteractionService';
import { LocalStorage } from '../services/LocalStorage';
import { TYPES } from './inversifyTypes';

const container = new Container();

container.bind(TYPES.BaseApiInteractionService).to(BaseApiInteractionService).inSingletonScope();
container.bind(TYPES.ApiInteractionService).to(ApiInteractionService).inSingletonScope();
container.bind(TYPES.LocalStorage).to(LocalStorage).inSingletonScope();
container
    .bind<OpenWeatherMapInteractionService>(TYPES.OpenWeatherMapInteractionService)
    .to(OpenWeatherMapInteractionService)
    .inSingletonScope();

container.bind<WeatherStore>(TYPES.WeatherStore).to(WeatherStore).inSingletonScope();
container.bind<WeatherCardStore>(TYPES.WeatherCardStore).to(WeatherCardStore);
container.bind<FlipStore>(TYPES.FlipStore).to(FlipStore);

export default container;
