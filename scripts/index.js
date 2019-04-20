/* ----- UI Elements ----- */

const UI = (function () {
    let menu = document.querySelector('#menu-container');
    const showApp = () => {
        document.querySelector('#loader').classList.add('display-none');
        document.querySelector('main').removeAttribute('hidden');
    }

    const loadApp = () => {
        document.querySelector('#loader').classList.remove('display-none');
        document.querySelector('main').setAttribute('hidden', 'true');
    }

    // Show and hide menu
    const showMenu = () => menu.style.right = 0;
    const hideMenu = () => menu.style.right = '-65%';

    document.querySelector('#menu-open').addEventListener('click', showMenu);
    document.querySelector('#menu-button-close').addEventListener('click', hideMenu);

    // Toggle hourly weather
    const toggleHourlyWeather = () => {
        let hourlyWeather = document.querySelector('#hourly-weather-wrapper');
        let arrow = document.querySelector('#toggle-weather').children[0];
        visible = hourlyWeather.getAttribute('visible');
        dailyWeather = document.querySelector('#daily-weather-wrapper');

        if(visible == 'false') {
            hourlyWeather.setAttribute('visible', 'true');
            hourlyWeather.style.bottom = 0;
            arrow.style.transform = 'rotate(180deg)';
            dailyWeather.style.opacity = 0;
        } else if(visible == 'true') {
            hourlyWeather.setAttribute('visible', 'false');
            hourlyWeather.style.bottom = '-100%';
            arrow.style.transform = 'rotate(0deg)';
            dailyWeather.style.opacity = 1;
        } else console.error('Error rendering the state of the hourly weather panel');
    };

    document.querySelector('#toggle-weather').addEventListener('click', toggleHourlyWeather)
    
    return {
        showApp,
        loadApp
    }

})();

const getLocation = (function () {
    let location;

    const locationInput = document.querySelector('#location-input');
    const addCityButton = document.querySelector('#add-city-button');

    const addCity = () => {
        location = locationInput.value;
        locationInput.value = '';
        addCityButton.setAttribute('disabled', true);
        addCityButton.classList.add('disabled');
        console.log('Get weather data for', location);
    }

    addCityButton.addEventListener('click', addCity);
    
    locationInput.addEventListener('input', function () {
        let inputText = this.value.trim();

        if(inputText !== '') {
            addCityButton.removeAttribute('disabled');
            addCityButton.classList.remove('disabled');
        } else {
            addCityButton.setAttribute('disabled', true);
            addCityButton.classList.add('disabled');
        }
    })
})();

/* ----- UI Initialization ----- */

window.onload = function () {
    UI.showApp();
}