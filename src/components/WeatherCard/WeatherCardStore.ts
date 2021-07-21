import { isRight } from 'fp-ts/lib/Either';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { TYPES } from '../../inversify/inversifyTypes';
import { OpenWeatherMapInteractionService } from '../../services/apiServices/OpenWeatherMapInteractionService';

@injectable()
export class WeatherCardStore {
    private api: OpenWeatherMapInteractionService;
    public weatherData: any = null;

    constructor(@inject(TYPES.OpenWeatherMapInteractionService) api: OpenWeatherMapInteractionService) {
        this.api = api;
        makeObservable(this, {
            weatherData: observable,
            getWeather: action,
        });
    }

    public getWeather = async (city: string) => {
        const response = await this.api.getCurrentWeatherByCity(city);
        if (isRight(response)) {
            this.weatherData = response.right;
        }
    };
}
