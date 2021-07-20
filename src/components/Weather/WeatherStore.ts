import { inject, injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import { TYPES } from '../../inversify/inversifyTypes';
import { OpenWeatherMapInteractionService } from '../../services/apiServices/OpenWeatherMapInteractionService';
import { LocalStorage } from '../../services/LocalStorage';
import { City } from '../../typings/OWM';

@injectable()
export class WeatherStore {
    public weatherData: any = null;
    private localStorageField = 'cities';

    constructor(
        @inject(TYPES.OpenWeatherMapInteractionService) private api: OpenWeatherMapInteractionService,
        @inject(TYPES.LocalStorage) private ls: LocalStorage,
    ) {
        makeObservable(this, {
            weatherData: observable,
        });
    }

    public getCachedCities = (): City[] | undefined => {
        return this.ls.get(this.localStorageField);
    };

    public pushNewCity = (city: City) => {
        const existingCities = this.ls.get<City[]>(this.localStorageField) ?? [];
        existingCities?.push(city);
        this.ls.set(this.localStorageField, existingCities);
    };

    public removeCity = (city: string) => {
        const existingCities = this.ls.get<City[]>(this.localStorageField);
        return existingCities?.filter((c) => c.id !== city);
    };
}
