// const countrySelect = document.querySelector("#country-selection");
const cityInput = document.querySelector("#city");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");

const API_KEY = '1cb614ab5a621446ccb3dbe42275f36f'; // Paste your API here
// loading country list from json file



async function fetchCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const countries = await response.json();
    //   countriesData = countries; // Store countries data for later use

      const countrySelect = document.getElementById('country-selection');
      countrySelect.innerHTML = '<option value="">Select a country</option>';

      countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort countries alphabetically
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca2; // Country code (e.g., US, IN, etc.)
        option.textContent = country.name.common; // Country name
    
        countrySelect.appendChild(option);
      });
    //   console.log('countries loaded',countriesData);
      
      // Add event listener to fetch cities when a country is selected
      countrySelect.addEventListener('change', fetchCities);
    } catch (error) {
      console.error('Error fetching countries:', error);
      document.getElementById('country').innerHTML = '<option value="">Failed to load countries</option>';
    }
  }

  // Fetch cities for the selected country using GeoNames API
  async function fetchCities() {

    document.getElementById('weatherdescription').innerHTML =' '
    const country = document.getElementById('country-selection').value;
    const citySelect = document.getElementById('city');
    console.log('country selected:',country);
    
    if (!country) {
      citySelect.innerHTML = '<option value="">Select a country first</option>';
      citySelect.disabled = true;
      return;
    }

    // Find the selected country's data
    const selectedCountry = countriesData.find(c => c.cca2 === country);
    // what does c.cca2 mean?
    // cca2 is the country code of the country. it i used to uniquely identify the country.
    //cca2 is a property of the country object which is used to uniquely identify the country.
  
    console.log('selected country:-',selectedCountry);
    if (selectedCountry) {
      // Display the selected country data
      const capital = selectedCountry.capital
      const border_country = selectedCountry.borders;
      const continent = selectedCountry.continents;
      const car_drive_side =selectedCountry.car.side
      const spoken_lang =selectedCountry.languages;
      const flag_src = selectedCountry.flags.png;
      const pop_in_mil = selectedCountry.population;
      const population = pop_in_mil/1000000;
      console.log('flag of the country',flag_src)
      const country_currency = selectedCountry.currencies;
      let counLang =[];
      // let counCurr =[];
      for(const languageCode in spoken_lang){
        console.log('languages of selected country:', spoken_lang[languageCode]);
        counLang +=spoken_lang[languageCode]+' , '

      }
      for (const currencyCode in country_currency) {
        console.log('Currency name of selected country:', country_currency[currencyCode]);
        console.log('Currency symbol of selected country:', country_currency[currencyCode].symbol);
        counCurr = country_currency[currencyCode]

      }

  //     document.getElementById('weatherdescription').innerHTML =`    
  // <h4 class="weatherDescription">Weather Description</h4>
  //           <p>Temperature: <span id="temp"></span></p>
  //           <p>Feels Like: <span id="feels_like"></span></p>
  //           <p>Pressure: <span id="pressure"></span></p>
  //           <p>Humidity: <span id="humidity"></span></p>
  //           <p>Wind Speed: <span id="wind_speed"></span></p>
  //  `


  //     console.log('Capital of selected country:', selectedCountry.capital);

      console.log('border countries of selected country:', selectedCountry.borders);
      console.log('continent of selected country:', selectedCountry.continents);
      console.log('side of the driver of selected country',selectedCountry.car.side)
      const lan= selectedCountry.languages;
      console.log('languages of selected country:',lan)
      
      
      //find out the name of the currency of the selected country
      const currencies = selectedCountry.currencies;
      console.log('currencies of selected country',currencies)
      
    } else {
      console.log('Capital not found for the selected country');
    }
    const url_state = 'https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode='+country;
    const url = 'https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode='+country;
const options = {
  method: 'GET',
  headers: {
      'x-rapidapi-key': 'b63b4a1979msh378d430d6e244d8p1bc3a9jsn4746ae3f5f99',
      'x-rapidapi-host': 'country-state-city-search-rest-api.p.rapidapi.com'
  }
    };
    try {

          const response = await fetch(url, options);
          const response_state = await fetch(url_state, options);
        const data_state = await response_state.json();
        const data = await response.json();
          console.log('result of cities fro API',data);
        console.log('result of states fro API',data_state);
        if (!data || !Array.isArray(data)) {
          throw new Error('No cities found for the selected country');
        }
        
        
    
      // Fetch cities from GeoNames API
  //     const response = await fetch(
  //       `http://api.geonames.org/searchJSON?country=${country}&username=${geoNamesUername}`
  //     );
  //     const data = await response.json();

      // Check if the API returned valid data
      // if (!data.geonames || !Array.isArray(data.geonames)) {
      //   throw new Error('No cities found for the selected country');
      // }

      // Extract city names from the response
      const cities = data.map(city => city.name);

      // Populate the city dropdown
      citySelect.innerHTML = '<option value="">Select a city</option>';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city; // City name
        option.textContent = city; // City names
        citySelect.appendChild(option);
      });

      citySelect.disabled = false;
    } catch (error) {
      console.error('Error fetching cities:', error);
      citySelect.innerHTML = '<option value="">Failed to load cities</option>';
    }
  }

// Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="mt-3 d-flex justify-content-between">
                    <div>
                        <h3 class="fw-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <h6 class="my-3 mt-3">Temperature: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                        <h6 class="my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6 class="my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                    <div class="text-center me-lg-5">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>
                </div>`;
    } else {
        return `<div class="col mb-3">
                    <div class="card border-0 bg-secondary text-white">
                        <div class="card-body p-3 text-white">
                            <h5 class="card-title fw-semibold">(${weatherItem.dt_txt.split(" ")[0]})</h5>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather icon">
                            <h6 class="card-text my-3 mt-3">Temp: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                            <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                            <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                        </div>
                    </div>
                </div>`;
    }
}

// Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        console.log('data fetched for weather details',data);
        
        const forecastArray = data.list;
        console.log('foreccast array data that is fetched',forecastArray);
        const uniqueForecastDays = new Set();

        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            console.log('forecast date data for dates',forecastDate);
            console.log('forecast date data for unique dates',uniqueForecastDays);
            
            // Filter out duplicate dates and limit to 5 unique days
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";
        console.log('five days forecast data',fiveDaysForecast);
        
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                daysForecastDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

// Get coordinates of entered city name
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        console.log('data fetched for coordinates',data);
        
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

searchButton.addEventListener("click", () => getCityCoordinates());