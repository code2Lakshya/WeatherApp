const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-screen-container');
const userInfoContainer = document.querySelector('.user-info-container');
const grantAccess = document.querySelector('[data-grantAccess]');
const errorImage = document.querySelector('[data-error]');
let oldTab = userTab;
const api_key = "14909f9986c94b7433061e68f2794f6c";
oldTab.classList.add('current-tab');
getfromSessionStorage();
userTab.addEventListener('click', () => {
    switchTab(userTab);
});
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});
function switchTab(newTab) {
    if (oldTab != newTab) {
        oldTab.classList.remove('current-tab');
        oldTab = newTab;
        oldTab.classList.add('current-tab');
        if (!searchForm.classList.contains('active')) {
            errorImage.classList.remove('active');
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else {
            errorImage.classList.remove('active');
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage() {
    const localCordinates = sessionStorage.getItem('user-cordinates');
    if (!localCordinates) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const cordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}
async function fetchUserWeatherInfo(cordinates) {
    const { lat, lon } = cordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
        const data = await response.json();
        loadingScreen.classList.remove('active');
       userInfoContainer.classList.add('active'); 
       renderWeatherInfo(data);
    }
    catch (err) {
      console.log('bye bye tata');
    }
}
function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector('[data-weatherDescription]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temparature=document.querySelector('[data-temparature]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`
    temparature.innerText=`${weatherInfo?.main?.temp}℃`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

grantAccess.addEventListener('click',getLocation);
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('bhai tmhare computer se nhi ho payega');
    }
}
function showPosition(position){
    const userCordinate={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-cordinates",JSON.stringify(userCordinate));
    fetchUserWeatherInfo(userCordinate);
}
searchForm.addEventListener('submit',(e)=>{
    errorImage.classList.remove('active');
e.preventDefault();
const searchInput=document.querySelector('[data-searchInput]');
if(searchInput.value==="")return;
fetchSearchWeatherInfo(searchInput.value);
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{
 const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
    const data=await response.json();
    loadingScreen.classList.remove('active');
    if((data?.main)!=null){
        userInfoContainer.classList.add('active');
    renderWeatherInfo(data);
    }
    else
    errorImage.classList.add('active');
}
catch(err){
    console.log('nhi ho payega bhai tmse');
}
}