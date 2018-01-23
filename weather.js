


//problem area
function setup(){
	loadJSON("https://fcc-weather-api.glitch.me/api/current?lat=35&lon=139");
}



$("button").click(function(){
	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		console.log(lat);
		console.log(long);

		var url = "https://fcc-weather-api.glitch.me/api/current?lat="+ lat + "&lon=" + long;

		console.log(url);

		$.getJSON(url, function(apiResults){
			
			var city = apiResults.name;
			var country = apiResults.sys.country;
			var placeName = city + ", " + country;
			var temp = apiResults.main.temp;
			console.log(temp);
			//change the context of place
			$("#placeName").text(placeName);
			var addOnHTML = temp + " " + "<span>&#8451</span>"; 
			console.log(addOnHTML);
			//change the context of weather temperature
			$("#temperature").html(addOnHTML);

			var weather = apiResults.weather[0].main;
			var description = apiResults.weather[0].description;
			console.log(weather);
			console.log(description);

			//change the context of h2 weather
			$("#weather").text(weather);
			//change the context of h2 description
			$("#description").text(description);
			$("#description").css({
				"opacity":"0.5",
				"text-transform":"capitalize"
			});

			var icon = apiResults.weather[0].icon;
			console.log(icon);
			var imgHtml = "<img src=" + icon +  ">";
			$("#picture").html(imgHtml);



		});

	});
});