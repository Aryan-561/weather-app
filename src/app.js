let city = document.querySelector("#search");
let searchBtn = document.querySelector("#search-btn"); let main = document.querySelector("main");

// Event listener for pressing Enter key in the city input field
city.addEventListener("keyup", (key) => {
    if (key.code == "Enter") {
        searchBtn.click();
    }
})

// Event listener for clicking the search button
searchBtn.addEventListener("click", fetchApi);

// Function to fetch weather data asynchronously
async function fetchApi() {
    //
    document.body.className = (` bg-[url('src/img/front.jpg')] bg-cover bg-center min-h-screen`);

    main.innerHTML = "";
    i = 0;

    // Checking if the city input field is not empty
    if (city.value != "") {
        const currData = await currentWeather();
        const forecastData = await forecastWeather();

        // Checking if the response code indicates data not found (404)
        if (currData.cod == "404") {
            document.body.className = (` bg-[url('src/img/front.jpg')] bg-cover bg-center min-h-screen`);

            main.innerHTML = `<div class="text-white mx-auto py-6 mt-12 capitalize text-center font-bold border-2 border-white border-solid b [text-shadow:2px_2px_1px_black] bg-black/20 rounded-lg w-[80%] text-2xl sm:w-[60%] sm:text-3xl">${currData.message}</div>`
        }

        else {
            // Showing current weather data and forecast data
            showCurrData(currData);
            showForecastData(forecastData);
        }

    }
}

// Function to display current weather data
function showCurrData(res) {
    // Setting background image based on weather condition
    if (res.weather[0].id > 700 && res.weather[0].id < 800) {
        document.body.className = (`bg-[url('src/img/700.jpg')] bg-cover min-h-screen bg-center`);

    }

    else {
        document.body.className = (`bg-[url('src/img/${res.weather[0].main}.jpg')] bg-cover min-h-screen bg-center`);
    }

    // Displaying current weather data in main element
    main.innerHTML = `<div class="flex flex-col sm:flex-row w-[90%] sm:w-[60%] mx-auto my-6 sm:justify-evenly items-center rounded-xl   backdrop-blur-[2px] bg-white/10 text-white p-4 box-border border-2 border-solid [text-shadow:2px_2px_1px_black] border-white">

            <section class=" p-6">
                <h2 class="text-2xl text-center font-bold">${res.name}, ${res.sys.country}</h2>
                <div class="sm:flex sm:place-items-center">
                    <div><img class="drop-shadow-md object-contain" src ="https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></div>
                    <div class="text-4xl font-semibold text-center">${Math.round(res.main.temp)}&deg;C</div>
                </div>
                <div class="text-center mt-4 sm:mt-0 font-bold text-lg">${res.weather[0].main}</div>
            </section>

            <section class=" p-6">
            <div class="text-xl  font-medium flex flex-col gap-4">
                <div class=" font-semibold">Real feel: ${Math.round(res.main.feels_like)}&deg;C</div>

                <div class="flex items-center gap-4"><img class="w-10" src="https://img.icons8.com/?size=96&id=3rq64owJ8cWB&format=png" title="Pressure"> <div>${res.main.pressure}hPa</div></div>
                <div class="flex items-center gap-4"><img class="w-8" src="https://img.icons8.com/?size=100&id=18585&format=png" title="Humidity"> <div>${res.main.humidity}%</div></div>

                <div class="flex items-center gap-4"><img class="w-8" src="https://img.icons8.com/?size=160&id=107769&format=png" title="wind"> 
                <div class="flex gap-2 items-center "><div class="rotate-[${204}deg]"><img src="https://img.icons8.com/?size=48&id=jLkEh2zFhThT&format=png" class="w-4 rotate-[${res.wind.deg}deg] object-contain " ></div> <div>${res.wind.speed}m/s</div></div></div>

                
            </div>
            <section>
            
        </div>
        
        `;
}

// Function to display forecast weather data
function showForecastData(res) {
    const result = res.data;
    let div = document.createElement("div");

    // Looping through forecast data and creating HTML elements
    result.forEach(data => {
        div.innerHTML += `
        <div class=" group w-full hover:w-[70%] hover:sm:w-40 hover:rounded-lg sm:w-40 sm:h-[224px] my-2 sm:m-2 hover:m-2 border-2  rounded-[5rem] shrink-0 sm:rounded-lg hover:sm:scale-110 duration-500 bg-white/30 ">

        <div class="flex justify-between text-white  py-1 px-4 group-hover:p-4 sm:p-4 sm:w-full  sm:flex-col group-hover:flex-col group-hover:gap-y-2 font-semibold sm:font-bold items-center  text-lg sm:text-xl group-hover:text-2xl group-hover:sm:text-xl sm:gap-y-2  ">

        <div class="flex  group-hover:flex-col group-hover:gap-y-2  sm:flex-col justify-center  items-center sm:gap-y-2">

        <div class="flex justify-center "><img class="w-10 sm:w-16 group-hover:w-16" src="https://cdn.weatherbit.io/static/img/icons/${data.weather.icon}.png"></div>
        <div class=" ml-2 sm:ml-0">${day(dayOfWeekIndex++)} ${data.valid_date.slice(8)}</div>
        </div>

        <div class="">${Math.round(data.high_temp)}°/${Math.round(data.low_temp)}° </div>

        <div class="font-semibold text-base hidden sm:block group-hover:text-lg group-hover:sm:text-base group-hover:block">${data.weather.description}</div>
        </div>
        </div>
        `;
    });

    // Adding CSS classes to the div and appending it to the main element
    div.classList.add("flex", "text-center", "flex-col", "sm:flex-row", "items-center", "w-[90%]", "mx-auto", "justify-center", "backdrop-blur-[2px]", "bg-black/10", "sm:flex-wrap", "px-2", "py-6", "rounded-xl", "my-6", "border-[3px]", "border-solid", "border-white", "[text-shadow:2px_2px_1px_black]");

    main.appendChild(div);
}

// Function to fetch current weather data
async function currentWeather() {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city.value}&appid=9c4711a44bd52c6f69da6ddafd193fcd`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        return data;
    }
    catch (err) {
        console.log(err);
        main.innerHTML = `
    <div class="text-white mx-auto py-6 mt-12 capitalize text-center font-bold border-2 border-white border-solid b [text-shadow:2px_2px_1px_black] bg-black/20 rounded-lg w-[80%] text-2xl sm:w-[60%] sm:text-3xl">Data Not Found</div>
    `;
    }
}

// Function to fetch forecast weather data
async function forecastWeather() {
    try {
        let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city.value}&key=a0f24e17f70a40da8d4270480ba589fa`
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

// Getting current day of the week
const today = new Date();
let dayOfWeekIndex = today.getDay();
let i = 0;

// Function to get day of the week
function day(index) {
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thru", "Fri", "Sat"];
    if (dayOfWeek[index] == "Sat") {
        dayOfWeekIndex = 0;
    }
    
    if (i == 0) {
        i++;
        return "Today";
    }

    else {
        return dayOfWeek[index];
    }

}
