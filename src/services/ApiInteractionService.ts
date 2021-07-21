import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { bimap, Either } from 'fp-ts/Either';
import { inject, injectable } from 'inversify';
import * as qs from 'querystring';
import { IApiInteractionService } from 'typings/apiTypes';
import { API_URL } from '../config/serverRouteConstants';
import { TYPES } from '../inversify/inversifyTypes';
import { RequestSettings } from '../typings/common';
import BaseApiInteractionService from './BaseApiInteractionService';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { NetworkError } from './errors/NetworkError';

@injectable()
class ApiInteractionService implements IApiInteractionService {
    constructor(@inject(TYPES.BaseApiInteractionService) private fetcher: BaseApiInteractionService) {}

    public get<T = any>(
        url: string,
        data?: any,
        host: string = API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'get', url: url, params: data, baseURL: host, ...config });
    }

    public post<T = any>(
        url: string,
        data?: any,
        host: string = API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        const parsedData = settings?.stringify ? qs.stringify(data) : data;
        const parsedConfig = settings?.multipartData ? this.setMultipartDataHeader(config) : config;

        return this.query<T>({ method: 'post', url: url, baseURL: host, data: parsedData, ...parsedConfig });
    }

    public put<T = any>(
        url: string,
        data?: any,
        host: string = API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'put', url: url, baseURL: host, data: data, ...config });
    }

    public delete<T = any>(
        url: string,
        data?: any,
        host: string = API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'delete', url: url, data: data, baseURL: host, ...config });
    }

    private query = async <T>(config: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
        };

        const req = axios.request<T>({ ...newConfig });
        const response = await this.fetcher.request<T>(req);

        return bimap(
            (e: NetworkError) => new BaseInteractionError(e.message),
            (res: AxiosResponse<T>) => res.data,
        )(response);
    };

    private setMultipartDataHeader = (config?: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        };
        return newConfig;
    };
}

export default ApiInteractionService;
