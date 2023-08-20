const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userWeather = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
let api_key = "acd3bf6eade50596c533a49e4a326806";

currentTab.classList.add("current-tab");
getfromSessionStorage();


userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function switchTab(clicked_tab) {
    if (clicked_tab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clicked_tab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")

        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherinfo(coordinates);
    }
}
async function fetchUserWeatherinfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderUserInfo(data);
    }
    catch (e) {
        loadingScreen.classList.remove('active');
    }
}

function renderUserInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]")
    const weatherDesc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temperature = document.querySelector("[data-temperature]")
    const windSpeed = document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`
    temperature.textContent = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)}°C`;
    windSpeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {

    }
}
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherinfo(userCoordinates);
}

const grantAccess = document.querySelector("[data-grantAccess]");
grantAccess.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName == "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName)
    }
})
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    const error = document.querySelector('.error-found')
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);
        const data = await response.json();
        if (data?.cod === '404') {
            loadingScreen.classList.remove('active');
            error.classList.add('active');
        }
        else {
            loadingScreen.classList.remove('active');
            error.classList.remove('active');
            userInfoContainer.classList.add('active');
            renderUserInfo(data);
        }

    }
    catch (e) {
        loadingScreen.classList.remove('active');
        const error = document.querySelector('.error-found')
        error.classList.add('active');
    }
}
