import { Button, TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import React from 'react';
import data from '../../data/city.list.json';
import { TYPES } from '../../inversify/inversifyTypes';
import { useInject } from '../../services/hooks';
import { City } from '../../typings/OWM';
import { SortableCitiesList } from './SortableCitiesList';
import { WeatherStore } from './WeatherStore';

export const Settings = () => {
    const store = useInject<WeatherStore>(TYPES.WeatherStore);
    let newCity: City | null = null;

    return (
        <>
            <SortableCitiesList items={store.getCachedCities()!} />
            <form onSubmit={() => store.pushNewCity(newCity!)}>
                <Autocomplete
                    id="cities"
                    options={data as any[]}
                    getOptionLabel={(option: any) => option.name}
                    style={{ width: 300 }}
                    filterOptions={createFilterOptions({ limit: 30 })}
                    onChange={(e, value) => {
                        newCity = value;
                    }}
                    renderInput={(params: any) => <TextField {...params} label="Combo box" variant="outlined" />}
                />

                <Button>Create</Button>
            </form>
        </>
    );
};
