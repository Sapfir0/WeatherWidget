import { inject, injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
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
        });
    }

    public getWeather = async (city: string) => {
        const response = await this.api.request(city);
        console.log(response);
        this.weatherData = response;
    };
}
