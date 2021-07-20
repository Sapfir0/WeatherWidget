import { Weather } from "../components/Weather/Weather";
import React from "react";

export default class WeatherWidget extends HTMLElement {
    createCollapsed() {
        return React.createElement(Weather, React.createElement('slot'));
      }
}

window.customElements.define('weather-widget', WeatherWidget);
