


// Free weather API - no API key required for basic usage
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "demo"; // Using demo mode for now

// Function to get weather by coordinates
function getWeatherByCoords(lat, lon) {
    // Using a free weather API service
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    
    $.getJSON(url, function(data) {
        displayWeatherFromOpenMeteo(data, lat, lon);
    }).fail(function() {
        // Fallback to a mock weather display
        displayMockWeather();
    });
}

// Function to get location name using reverse geocoding
function getLocationName(lat, lon) {
    const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    
    return $.getJSON(geocodeUrl).promise();
}

// Display weather data from Open-Meteo API
function displayWeatherFromOpenMeteo(data, lat, lon) {
    const current = data.current_weather;
    const temp = Math.round(current.temperature);
    
    // Get location name
    getLocationName(lat, lon).then(function(location) {
        const placeName = location.city ? `${location.city}, ${location.countryCode}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        $("#placeName").text(placeName);
    }).fail(function() {
        $("#placeName").text(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    });
    
    // Display temperature
    const tempHTML = temp + " " + "<span>&#8451;</span>";
    $("#temperature").html(tempHTML);
    
    // Weather condition mapping
    const weatherCodes = {
        0: { main: "Clear", description: "clear sky", icon: "☀️" },
        1: { main: "Mainly Clear", description: "mainly clear", icon: "🌤️" },
        2: { main: "Partly Cloudy", description: "partly cloudy", icon: "⛅" },
        3: { main: "Overcast", description: "overcast", icon: "☁️" },
        45: { main: "Fog", description: "fog", icon: "🌫️" },
        48: { main: "Fog", description: "depositing rime fog", icon: "🌫️" },
        51: { main: "Drizzle", description: "light drizzle", icon: "🌦️" },
        53: { main: "Drizzle", description: "moderate drizzle", icon: "🌦️" },
        55: { main: "Drizzle", description: "dense drizzle", icon: "🌦️" },
        61: { main: "Rain", description: "slight rain", icon: "🌧️" },
        63: { main: "Rain", description: "moderate rain", icon: "🌧️" },
        65: { main: "Rain", description: "heavy rain", icon: "🌧️" },
        71: { main: "Snow", description: "slight snow fall", icon: "🌨️" },
        73: { main: "Snow", description: "moderate snow fall", icon: "🌨️" },
        75: { main: "Snow", description: "heavy snow fall", icon: "❄️" },
        95: { main: "Thunderstorm", description: "thunderstorm", icon: "⛈️" }
    };
    
    const weatherInfo = weatherCodes[current.weathercode] || { main: "Unknown", description: "unknown weather", icon: "❓" };
    
    $("#weather").text(weatherInfo.main);
    $("#description").text(weatherInfo.description);
    $("#description").css({
        "opacity": "0.7",
        "text-transform": "capitalize"
    });
    
    // Display weather icon
    $("#picture").html(`<span style="font-size: 60px;">${weatherInfo.icon}</span>`);
}

// Mock weather display as fallback
function displayMockWeather() {
    $("#placeName").text("Demo Location");
    $("#temperature").html("22 <span>&#8451;</span>");
    $("#weather").text("Partly Cloudy");
    $("#description").text("Partly cloudy skies");
    $("#description").css({
        "opacity": "0.7",
        "text-transform": "capitalize"
    });
    $("#picture").html('<span style="font-size: 60px;">⛅</span>');
}

// Button click handler
$("button").click(function(){
    $("#placeName").text("Getting your location...");
    $("#temperature").html("");
    $("#weather").text("");
    $("#description").text("");
    $("#picture").html("");
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log("Location:", lat, lon);
            getWeatherByCoords(lat, lon);
        }, function(error) {
            console.log("Geolocation error:", error);
            $("#placeName").text("Location access denied");
            displayMockWeather();
        });
    } else {
        $("#placeName").text("Geolocation not supported");
        displayMockWeather();
    }
});