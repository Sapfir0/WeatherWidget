import { inject, injectable } from 'inversify';
import { API_KEY } from '../../config/serverRouteConstants';
import { TYPES } from '../../inversify/inversifyTypes';
import { IApiInteractionService } from '../../typings/apiTypes';

@injectable()
export class OpenWeatherMapInteractionService {
    constructor(@inject(TYPES.ApiInteractionService) protected _apiService: IApiInteractionService) {}

    public request = async (city: string) => {
        const response = await this._apiService.get(`weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
            },
        });
        return response;
    };
}
