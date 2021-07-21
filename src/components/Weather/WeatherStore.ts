import { isRight } from 'fp-ts/lib/Either';
import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { TYPES } from '../../inversify/inversifyTypes';
import { OpenWeatherMapInteractionService } from '../../services/apiServices/OpenWeatherMapInteractionService';
import { LocalStorage } from '../../services/LocalStorage';
import { getCoords } from '../../services/utils';
import { City } from '../../typings/OWM';

@injectable()
export class WeatherStore {
    public initialCity: City | null = null;
    private localStorageField = 'cities';

    constructor(
        @inject(TYPES.OpenWeatherMapInteractionService) private api: OpenWeatherMapInteractionService,
        @inject(TYPES.LocalStorage) private ls: LocalStorage,
    ) {
        makeObservable(this, {
            initialCity: observable,
            init: action,
            cities: computed,
        });
    }

    public init = async () => {
        if (!this.cities) {
            const position = await getCoords();
            const weatherData = await this.getWeatherByPosition(position);
            const newCity: City = { name: weatherData.name, country: weatherData.sys.country, id: weatherData.sys.id };
            this.pushNewCity(newCity);
            this.initialCity = newCity;
            console.log(this.initialCity);
        }
    };

    public get cities(): City[] | undefined {
        return this.ls.get(this.localStorageField);
    }

    public pushNewCity = (city: City) => {
        const existingCities = this.ls.get<City[]>(this.localStorageField) ?? [];
        existingCities?.push(city);
        this.ls.set(this.localStorageField, existingCities);
    };

    public removeCity = (city: City) => {
        const existingCities = this.ls.get<City[]>(this.localStorageField);
        return existingCities?.filter((c) => c.id !== city.id);
    };

    public getWeatherByPosition = async (latlon: { latitude: number; longitude: number }) => {
        const { longitude, latitude } = latlon;
        const response = await this.api.getCurrentWeatherByPosition(latitude, longitude);
        if (isRight(response)) {
            return response.right;
        }
    };
}
