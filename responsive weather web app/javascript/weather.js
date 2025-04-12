const apiKey = '1cb614ab5a621446ccb3dbe42275f36f'; // Replace with your OpenWeatherMap API key
    const geoNamesUsername = 'kamal2025'; // Replace with your GeoNames username
    let countriesData = [];

    // Fetch list of countries and populate the dropdown
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        countriesData = countries; // Store countries data for later use

        const countrySelect = document.getElementById('country');
        countrySelect.innerHTML = '<option value="">Select a country</option>';

        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort countries alphabetically
        countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.cca2; // Country code (e.g., US, IN, etc.)
          option.textContent = country.name.common; // Country name
          countrySelect.appendChild(option);
        });
        console.log('countries loaded',countriesData);
        
        // Add event listener to fetch cities when a country is selected
        countrySelect.addEventListener('change', fetchCities);
      } catch (error) {
        console.error('Error fetching countries:', error);
        document.getElementById('country').innerHTML = '<option value="">Failed to load countries</option>';
      }
    }

    // Fetch cities for the selected country using GeoNames API
    async function fetchCities() {
      document.getElementById('result').innerHTML =' '
      const country = document.getElementById('country').value;
      const citySelect = document.getElementById('city');

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

        document.getElementById('countryData').innerHTML =`    
    <h2>Country Data</h2>
    <img src ="${flag_src}">
    <p>Capital: <span id="capital">${capital}</span></p>
    <p> Country Population <span id ="population">${population} Millions</span></p>
    <p>Border Countries: <span id="borders">${border_country}</span></p>
    <p>Continent: <span id="continent">${continent}</span></p>
    <p>Side of the road: <span id="side">${car_drive_side}</span></p>
    <p>Languages: <span id="languages">${counLang}</span></p>
    <p>Currency: <span id="currency">${counCurr.name}</span></p>
    <p> Currency Symbol: <span id ="curr_symbol">${counCurr.symbol}</span></p>
    
    `


        console.log('Capital of selected country:', selectedCountry.capital);

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

      try {
        // Fetch cities from GeoNames API
        const response = await fetch(
          `https://api.geonames.org/searchJSON?country=${country}&username=${geoNamesUsername}`
        );
        const data = await response.json();

        // Check if the API returned valid data
        if (!data.geonames || !Array.isArray(data.geonames)) {
          throw new Error('No cities found for the selected country');
        }

        // Extract city names from the response
        const cities = data.geonames.map(city => city.name);

        // Populate the city dropdown
        citySelect.innerHTML = '<option value="">Select a city</option>';
        cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city; // City name
          option.textContent = city; // City name
          citySelect.appendChild(option);
        });

        citySelect.disabled = false;
      } catch (error) {
        console.error('Error fetching cities:', error);
        citySelect.innerHTML = '<option value="">Failed to load cities</option>';
      }
    }

    // Fetch weather data for the selected city and country
    async function getWeather() {
      const country = document.getElementById('country').value;
      const city = document.getElementById('city').value;

      if (!country || !city) {
        alert('Please select a country and a city.');
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('weather data of selected country',data);
        if (data.cod !== 200) {
          throw new Error(data.message);
        }
        
        const sunrise = data.sys.sunrise; // Sunrise time (Unix timestamp)
        const sunset = data.sys.sunset; // Sunset time (Unix timestamp)
        const timezone = data.timezone; // Timezone offset in seconds
        const country= data.sys.country;
        console.log('country code of the selected country:',country);
        const capital= data.name;
        const temp_max = data.main.temp_max;
        const temp_feels_like = data.main.feels_like;
        const description =data.weather[0].description;
        console.log('description of the selected country:',description);
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const wind_speed = data.wind.speed;



        // Convert timestamps to the selected country's timezone
        const sunriseTime = formatTime(sunrise, timezone);
        const sunsetTime = formatTime(sunset, timezone);
        

        // Display the results
        document.getElementById('result').innerHTML = `
          <p>City: ${data.name}, ${data.sys.country}</p>
          <p>Sunrise: ${sunriseTime}</p>
          <p>Sunset: ${sunsetTime}</p>
          <p id ="temp">Temperature: ${temp_max}°C</p>	
          <p> Feels Like: ${temp_feels_like}°C</p>
          <p> Description: ${description}</p>
          <p> Pressure: ${pressure} hPa</p>
          <p> Humidity: ${humidity}%</p>
          <p> Wind Speed: ${wind_speed} m/s</p>

        `;
        if(temp_max>30){
          document.getElementById('temp').style.color = 'red';

        }else{
          document.getElementById('temp').style.color ='green';
        }

      } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      }
    }

    // Format time based on timezone offset
    function formatTime(timestamp, timezone) {
      const date = new Date((timestamp + timezone) * 1000); // Adjust for timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC', // Use UTC because we've already adjusted for timezone
      });
      return formatter.format(date);
    }

    // Fetch countries when the page loads
    fetchCountries();
    