import { observer } from 'mobx-react';
import React from 'react';
import { Weather } from './components/Weather/Weather';

const App = observer(() => {
    return (
        <div className="App">
            <Weather />
        </div>
    );
});

export default App;
