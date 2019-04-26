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

    const pullWeatherData = (data, location) => {
        console.log(data);
        console.log(location);

        let currentlyData = data.currently;
        let dailyData = data.daily.data;
        let hourlyData = data.hourly.data;
        let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dailyWeatherWrapper = document.querySelector('#daily-weather-wrapper');
        let dailyWeatherModel;
        let day;
        let maxMinTemp;
        let dailyIcon;
        let hourlyWeatherWrapper = document.querySelector('#hourly-weather-wrapper');
        let hourlyWeatherModel;
        let hourlyIcon;

        // Set current weather
        // Set current location
        document.querySelectorAll('.location-label').forEach((element) => {
            element.innerHTML = location;
        });

        // Set background
        document.querySelector('main').style.backgroundImage = `url('./assets/images/bg-images/${currentlyData.icon}.jpg')`;

         // Set summary
        document.querySelector('#currently-icon').setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
        document.querySelector('#summary-label').innerHTML = currentlyData.summary;

        document.querySelector('#degrees-label').innerHTML = Math.round(currentlyData.temperature) + '&#176';
        // Set Humidity
        document.querySelector('#humidity-label').innerHTML = Math.round(currentlyData.humidity * 100) + '%';

        // Set Wind Spped
        document.querySelector('#wind-speed-label').innerHTML = currentlyData.windSpeed.toFixed(1) + 'm/h';

        // Set daily weather
        while(dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1])
        }

        while(hourlyWeatherWrapper.children[1]) {
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1])
        }

        

        // Loop through and show daily weather forecast
        for(let i = 0; i <= 6; i++) {
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true); 
            dailyWeatherModel.classList.remove('display-none');
            // Set day 
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()]
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            // Get Min and Max temps
            maxMinTemp = Math.round(dailyData[i].temperatureMax) + '&#176;' + "/" + Math.round(dailyData[i].temperatureMin) + '&#176;'
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
            // Get daily icons
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src',`./assets/images/summary-icons/${dailyIcon}-white.png`);
            // Append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        }

        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');
        UI.showApp();
    };

    // Menu Events
    document.querySelector('#menu-open').addEventListener('click', showMenu);
    document.querySelector('#menu-button-close').addEventListener('click', hideMenu);

    // Toggle hourly weather event
    document.querySelector('#toggle-weather').addEventListener('click', toggleHourlyWeather);

    return {
        showApp,
        loadApp,
        pullWeatherData
    }

})();

    // Get weather locaiton
    const getLocation = (function () {
        let location;

        const locationInput = document.querySelector('#location-input');
        const addCityButton = document.querySelector('#add-city-button');

        const addCity = () => {
            location = locationInput.value;
            locationInput.value = '';
            addCityButton.setAttribute('disabled', true);
            addCityButton.classList.add('disabled');
            WEATHER.getWeather(location);
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

const WEATHER = (function () {
    const darkSkyKey = '55917ecfc1b2dcf2f054fafcfe0a95cf';
    const geoLocationKey = '89501d843167401e8ca77422ead8fe2f'; // OpenCageData API
    // Connect to DarkSky and OpenCage API
    const getgeoLocationURL = (location) => 
        `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geoLocationKey}`;
    const darkSkyURL = (lat, long) => 
        `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${long}`;

        const getDarkSkyURL = (url, location) => {
            axios.get(url)
            .then( (res) => {
                console.log(res);
                UI.pullWeatherData(res.data, location)
            })
            .catch( (err) => {
                console.err(err)
            })
        }
    const getWeather = (location) => {
        UI.loadApp();
        let getLocationURL = getgeoLocationURL(location);

        axios.get(getLocationURL)
        .then((res) => {
            let lat = res.data.results[0].geometry.lat;
            let long = res.data.results[0].geometry.lng;

            let darkSkyData = darkSkyURL(lat, long);
            getDarkSkyURL(darkSkyData, location);
        })
        .catch((err) => {
            console.log(err)
        })
    };

    return {
        getWeather
    }

})();
/* ----- UI Initialization ----- */

window.onload = function () {
    UI.showApp();
}