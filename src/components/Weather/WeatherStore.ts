import { isRight } from 'fp-ts/lib/Either';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { TYPES } from '../../inversify/inversifyTypes';
import { OpenWeatherMapInteractionService } from '../../services/apiServices/OpenWeatherMapInteractionService';
import { LocalStorage } from '../../services/LocalStorage';
import { getCoords, reorder } from '../../services/utils';
import { City } from '../../typings/OWM';

@injectable()
export class WeatherStore {
    public initialCity: City | null = null;
    private localStorageField = 'cities';
    public cities: City[] | undefined = [];

    constructor(
        @inject(TYPES.OpenWeatherMapInteractionService) private api: OpenWeatherMapInteractionService,
        @inject(TYPES.LocalStorage) private ls: LocalStorage,
    ) {
        makeObservable(this, {
            initialCity: observable,
            init: action,
            cities: observable,
        });
        this.cities = this.ls.get(this.localStorageField);
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

    public pushNewCity = (city: City) => {
        this.cities?.push(city);
        this.ls.set(this.localStorageField, this.cities);
    };

    public reorder = (startIndex: number, endIndex: number) => {
        const existingCities = reorder(this.cities!, startIndex, endIndex);
        this.ls.set(this.localStorageField, existingCities);
        this.cities = existingCities;
    };

    public removeCity = (city: City) => {
        const existingCities = this.cities?.filter((c) => c.id !== city.id);
        this.ls.set(this.localStorageField, existingCities);
        this.cities = existingCities!;
    };

    public getWeatherByPosition = async (latlon: { latitude: number; longitude: number }) => {
        const { longitude, latitude } = latlon;
        const response = await this.api.getCurrentWeatherByPosition(latitude, longitude);
        if (isRight(response)) {
            return response.right;
        }
    };
}
