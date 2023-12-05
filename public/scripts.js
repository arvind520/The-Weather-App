console.log("Hello from scripts")
const search_input = document.getElementById('search');
const results = document.getElementById('results');
const weatherContainer = document.getElementById("weather");
weatherContainer.style.display = 'none'
let search_term = '';
let cities;

const fetchCities = async () => {
  cities = await fetch(
    'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json'
  ).then((res) => res.json());
};

const showCities = async () => {
  results.innerHTML = '';
  results.classList.add('cities');
  cities
    .filter((city) =>
      city.name.toLowerCase().includes(search_term.toLowerCase())
    )
    .forEach((city) => {
      const li = document.createElement('li');
      li.classList.add('city-item');
      li.innerText = city.name;
      li.dataset.lat = city.lat;
      li.dataset.lng = city.lng;
      results.appendChild(li);
    });
};

fetchCities();

search_input.addEventListener('input', (e) => {
  search_term = e.target.value;
  showCities();
});

results.addEventListener("click", async (e)=>{
  console.log(e.target.dataset.lat, e.target.dataset.lng, e.target.innerText)
  weatherContainer.innerHTML="";
  search_input.value = e.target.innerText
  results.innerHTML=""
  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${e.target.dataset.lat}&lon=${e.target.dataset.lng}&appid=e926903dbcc484af23b2509b1daec7f2`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // do something with the weather data
    weatherContainer.style.display = 'block'
    let d1 = document.createElement("div")
    d1.classList.add("card-header");
    d1.innerText = e.target.innerText;
    weatherContainer.appendChild(d1)

    let d2 = document.createElement('div');
    d2.classList.add("card-body");

    let h2 = document.createElement("h5");
    h2.classList.add('card-title');
    h2.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${data.weather[0].description}`;
    h2.style.textTransform = 'capitalize';
    h2.style.borderBottom = '2px solid whitesmoke'

    d2.appendChild(h2);

    let row1 = document.createElement('div')
    row1.classList.add('row');
    row1.classList.add('my-5');

    let c1 = document.createElement('div');
    c1.classList.add('col');
    c1.innerHTML = `<img src="icons/humidity.png" class="icon-img"/> <strong>Humidity: </strong> ${data.main.humidity}%`
    row1.appendChild(c1);

    let c2 = document.createElement('div');
    c2.classList.add('col');
    c2.innerHTML = `<img src="icons/pressure-gauge.png" class="icon-img"/> <strong>Pressure: </strong> ${data.main.pressure}hPa`
    row1.appendChild(c2);

    let c3 = document.createElement('div');
    c3.classList.add('col');
    c3.innerHTML = `<img src="icons/high-temperature.png" class="icon-img"/> <strong>Temperature: </strong> ${(data.main.temp - 273.15).toFixed(1)}°C`
    row1.appendChild(c3);
    
    d2.appendChild(row1)

    let row2 = document.createElement('div')
    row2.classList.add('row');

    let c4 = document.createElement('div');
    c4.classList.add('col');
    c4.innerHTML = `<img src="icons/wind-socket.png" class="icon-img"/> <strong>Wind Speed: </strong> ${data.wind.speed}m/s`
    row2.appendChild(c4);

    let c5 = document.createElement('div');
    c5.classList.add('col');
    c5.innerHTML = `<img src="icons/sunrise.png" class="icon-img"/> <strong>Sunrise: </strong> ${new Date(data.sys.sunrise).toLocaleTimeString()}`
    row2.appendChild(c5);

    let c6 = document.createElement('div');
    c6.classList.add('col');
    c6.innerHTML = `<img src="icons/sunset.png" class="icon-img"/> <strong>Sunset: </strong> ${new Date(data.sys.sunset).toLocaleTimeString()}`
    row2.appendChild(c6);

    d2.appendChild(row2);

    weatherContainer.appendChild(d2);
  })
  .catch(error => console.error(error));

})

