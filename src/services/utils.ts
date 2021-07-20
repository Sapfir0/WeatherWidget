export const degToCompass = (num: number) => {
    const val = Math.round(num / 22.5 + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[val % 16];
};

export const geoFindMe = () => {
    let coordinates = { latitude: 0, longitude: 0 };
    function success(position: any) {
        console.log(position);
        const { latitude, longitude } = position.coords;
        coordinates = { latitude, longitude };
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    }
    return;
};


export const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};