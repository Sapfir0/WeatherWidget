import { TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { observer } from 'mobx-react';
import React from 'react';
import data from '../../data/city.list.json';
import { TYPES } from '../../inversify/inversifyTypes';
import { useInject } from '../../services/hooks';
import { City } from '../../typings/OWM';
import { SortableCitiesList } from './SortableCitiesList';
import { WeatherStore } from './WeatherStore';

export const Settings = observer(() => {
    const store = useInject<WeatherStore>(TYPES.WeatherStore);
    let newCity: City | null = null;

    console.log(store.cities);
    return (
        <>
            <SortableCitiesList items={store.cities} />
            <form onSubmit={() => store.pushNewCity(newCity!)}>
                <Autocomplete
                    id="cities"
                    options={data as City[]}
                    getOptionLabel={(option) => option.name}
                    filterOptions={createFilterOptions({ limit: 30 })}
                    onChange={(e, value) => {
                        newCity = value;
                    }}
                    renderInput={(params: any) => (
                        <TextField {...params} label="Type here your city" variant="outlined" />
                    )}
                />
                <input type="submit" />
            </form>
        </>
    );
});
