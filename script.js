    let city;
    let lat;
    let lon;
    let tempUnit = "celsius";
    let windUnit = "kmh";
    let precUnit = "mm";
    const input = document.querySelector("input.city");
    const hover = document.querySelector(".cityhover");

    input.addEventListener("input", async function(){

        let city = input.value;

        if(city.length < 2){
            hover.classList.remove("active");
            return;
        }

        let url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`;

        let response = await fetch(url);
        let data = await response.json();

        hover.innerHTML = "";

        if(!data.results) return;

        data.results.forEach(place => {

            let item = document.createElement("section");

            item.innerText = `${place.name}, ${place.country}`;

            item.addEventListener("click", function(){

                input.value = place.name;
                hover.classList.remove("active");

                weather(place.latitude, place.longitude); // your weather function
            });

            hover.appendChild(item);
        });

        hover.classList.add("active");
    });
    // let tempUnit = "fahrenheit";
    // let windUnit = "mph";
    // let precUnit = "inch"
    function units(){
        let unit = document.querySelector("div.unit-list");
        unit.classList.toggle("active");
    }
    document.addEventListener("click", function(event){
        let unit = document.querySelector("div.unit-list");
        let button = document.querySelector("button.units");
        if (!unit.contains(event.target) && !button.contains(event.target)){
            unit.classList.remove("active")
        }
    })
    function imp(){
        tempUnit = "fahrenheit";
        windUnit = "mph";
        precUnit = "inch";
        weather();  
    }
    function tempUnits(unit){
        tempUnit = unit;
        weather();
    }
    function windUnits(unit){
        windUnit = unit;
        weather();
    }
    function precUnits(unit){
        precUnit = unit;
        weather();
    }
    document.addEventListener("click", function(event){
        let hover = document.querySelector(".cityhover");
        let field = document.querySelector("input.city");
        if(!hover) return;
        if(field.contains(event.target)){
            hover.classList.toggle("active");
        }
        else{
            hover.classList.remove("active");
        }
    })
    document.querySelector("input.city").addEventListener("keydown",function(event){
        if(event.key === "Enter"){
            locn();
            document.querySelector(".cityhover").remove("active");
        }
    })
    function geolocn(){
        navigator.geolocation.getCurrentPosition(async function(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            let url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
            response = await fetch(url);
            let data = await response.json();
            country = data.localityInfo.administrative[0].name;
            city = data.localityInfo.administrative[2].name;
            weather();
        })
    }
    async function locn(){
        city = document.querySelector("input.city").value;
        let url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
        let response = await fetch(url);
        let data = await response.json();
        lat = data.results[0].latitude;
        lon = data.results[0].longitude;
        weather();
    }
    async function weather(){
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precUnit}`;
        let response = await fetch(url);
        let data = await response.json();
        let time = await new Date(data.current.time);
        formatted = time.toLocaleString("en-IN",{
            weekday:"long",
            month:"short",
            day:"numeric",
            year:"numeric"
        })
        let code = data.current.weather_code;
        let temp = data.current.temperature_2m;
        let wind = data.current.wind_speed_10m;
        let prec = data.current.precipitation;
        let humidity = data.current.relative_humidity_2m;
        let apptemp = data.current.apparant_temperature;

        document.querySelector("#P1 h3.city").innerHTML = country+", "+city;
        document.querySelector("#P1 p.time").innerHTML = formatted;
        let icon = document.querySelector(".current-weather");

// WEATHER ICONS
        if(code == 0){
            icon.src = "images/sunny.webp";
            icon.style.animation = "none";
        }
        else if(code == 1 || code == 2){
            icon.src = "images/par-cloudy.webp";
            icon.style.animation = "none";
        }
        else if(code == 3){
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
        else if(code == 45 || code == 48){
            icon.src = "images/foggy.webp";
            icon.style.animation = "none";
        }
        else if(code == 51 || code == 53 || code == 55){
            icon.src = "images/drizzle.webp";
            icon.style.animation = "none";
        }
        else if(code == 61 || code == 63 || code == 65){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 71 || code == 73 || code == 75){
            icon.src = "images/snow.webp";
            icon.style.animation = "none";
        }
        else if(code == 80 || code == 81 || code == 82){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 95 || code == 96 || code == 99){
            icon.src = "images/storm.webp";
            icon.style.animation = "none";
        }
        else{
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
// WEATHER ICONS

        document.querySelector("#P1 h2").innerHTML = temp + " " + data.current_units.temperature_2m;

        if(apptemp == undefined){
            document.querySelector("#P2 h3").innerHTML = temp + " " + data.current_units.temperature_2m;
        }
        else{
            document.querySelector("#P2 h3").innerHTML = apptemp + " " + data.current_units.temperature_2m;
        }

        document.querySelector("#P3 h3").innerHTML = humidity + "%";
        document.querySelector("#P4 h3").innerHTML = wind + " " + data.current_units.wind_speed_10m;
        document.querySelector("#P5 h3").innerHTML = prec + " " + data.current_units.precipitation;

// Daily
    let day = document.querySelectorAll("section.DailyS");
     for(i=0;i<7;i++){
        let date = new Date(data.daily.time[i]);
        let dayname = date.toLocaleString("en-IN",{
            weekday:"short"
        });
        let code = data.daily.weather_code[i];
        let maxtemp = data.daily.temperature_2m_max[i];
        let mintemp = data.daily.temperature_2m_min[i];
        icon = day[i].querySelector("img");
        if(code == 0){
            icon.src = "images/sunny.webp";
            icon.style.animation = "none";
        }
        else if(code == 1 || code == 2){
            icon.src = "images/par-cloudy.webp";
            icon.style.animation = "none";
        }
        else if(code == 3){
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
        else if(code == 45 || code == 48){
            icon.src = "images/foggy.webp";
            icon.style.animation = "none";
        }
        else if(code == 51 || code == 53 || code == 55){
            icon.src = "images/drizzle.webp";
            icon.style.animation = "none";
        }
        else if(code == 61 || code == 63 || code == 65){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 71 || code == 73 || code == 75){
            icon.src = "images/snow.webp";
            icon.style.animation = "none";
        }
        else if(code == 80 || code == 81 || code == 82){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 95 || code == 96 || code == 99){
            icon.src = "images/storm.webp";
            icon.style.animation = "none";
        }
        else{
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
        day[i].querySelector("h3").innerHTML = dayname;
        day[i].querySelectorAll("p")[0].innerHTML = maxtemp + "°";
        day[i].querySelectorAll("p")[1].innerHTML = mintemp + "°";
    }

// Hourly   
     let sec = document.querySelectorAll(".hourly1");
     for(i=0;i<7;i++){
        let date = new Date(data.hourly.time[i]);
        let hour = date.toLocaleString("en-IN",{
            hour:"numeric"
        });
        let code = data.hourly.weather_code[i];
        let icon = sec[i].querySelector("img");
        if(code == 0){
            icon.src = "images/sunny.webp";
            icon.style.animation = "none";
        }
        else if(code == 1 || code == 2){
            icon.src = "images/par-cloudy.webp";
            icon.style.animation = "none";
        }
        else if(code == 3){
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
        else if(code == 45 || code == 48){
            icon.src = "images/foggy.webp";
            icon.style.animation = "none";
        }
        else if(code == 51 || code == 53 || code == 55){
            icon.src = "images/drizzle.webp";
            icon.style.animation = "none";
        }
        else if(code == 61 || code == 63 || code == 65){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 71 || code == 73 || code == 75){
            icon.src = "images/snow.webp";
            icon.style.animation = "none";
        }
        else if(code == 80 || code == 81 || code == 82){
            icon.src = "images/rain.webp";
            icon.style.animation = "none";
        }
        else if(code == 95 || code == 96 || code == 99){
            icon.src = "images/storm.webp";
            icon.style.animation = "none";
        }
        else{
            icon.src = "images/overcast.webp";
            icon.style.animation = "none";
        }
        let hrtemp = data.hourly.temperature_2m[i];
        sec[i].querySelector(".hourly1 h4").innerHTML = hour + "°";
        sec[i].querySelector(".hourly1 p").innerHTML = hrtemp + "°";
    }
    }
geolocn();