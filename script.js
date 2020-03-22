
$(document).ready(function () {

    // event listener on the Submit button
    $("#submitted-city").on("click", function (event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();

        //initialize the page
        $(".city").empty();
        $("#forecast").empty();

        // Storing the submitted city name
        var subCity = $("#city-input").val().trim();
        console.log(subCity);
        // OpenWeather API key
        var APIKey = "7321de3bce923134cdfb94c3f0188e62";

        // OpenWeather query for current weather with user imput and api key
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + subCity + "&units=imperial&appid=" + APIKey

        //declare and define date variables
        var longDate = new Date();
        console.log(longDate);
        var dd = longDate.getDate();
        var mm = longDate.getMonth() + 1;
        var yyyy = longDate.getFullYear();
        console.log(mm, dd, yyyy);

        //call functions for current weather and the five-day forecast
        displaySidebar(subCity);
        getCurrentWeather(queryURL, dd, mm, yyyy);
        getForecast(subCity, APIKey, dd, mm, yyyy);
    });

    //gets and renders current weather
    function getCurrentWeather(queryURL, dd, mm, yyyy) {
        if (dd < 10) {
            dd = '0' + dd;
        }
        var today = mm + '/' + dd + '/' + yyyy;


        // Call to OpenWeather server for current weather data, render city, today's date, weather icon
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the resulting object for reference
                console.log(response);
                var lat = response.coord.lat;
                var lon = response.coord.lon;

                //Retrieve the weather icon
                var icon = ("<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>");

                //Render City, date, and Weather Icon
                $(".city").append("<h3>" + response.name + " " + today + " " + icon + "</h3>");

                // Render Temp, Wind Speed, Humidity and UV content to HTML
                $(".temp").text("Temperature: " + response.main.temp + " degrees");   //add degress symbol
                $(".wind").text("Wind Speed: " + response.wind.speed + " mph");
                $(".humidity").text("Humidity: " + response.main.humidity + "%");

                //call the UV index functiongit 
                getCurrentUV(lat, lon);
            });
    };

    function getCurrentUV(lat, lon) {
        console.log(lat, lon);
        // Call to OpenWeather server for current weather data, render city, today's date, weather icon
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=7321de3bce923134cdfb94c3f0188e62&lat=" + lat + "&lon=" + lon,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the resulting object for reference
                console.log(response);

                // Transfer content to HTML
                $(".uvindex").text("UV Index:  " + response.value);
            });
    };

    // gets and displays the five-day forecast
    function getForecast(subCity, APIKey, dd, mm, yyyy) {
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

        $.ajax({
            url: forecastUrl, //API Call
            type: "GET",
            data: {
                q: subCity,
                appid: APIKey,
                units: "imperial",
            },
            success: function (response) {
                for (var i = 0; i < 5; i++) {
                    var placeHolder = response.list[i].main;
                    dd = dd + 1;
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    var forecastDate = mm + '/' + dd + '/' + yyyy;
                    var high = placeHolder.temp_max;
                    var humidity = placeHolder.humidity;
                    var icon = "<img src='https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png'>"
                    $("#forecast").append(
                        $('<div/>')
                            .attr("id", "eachForecast")
                            .addClass("forecastBox col")
                            .append("<h5>" + forecastDate + "</h5>")
                            .append("<p>" + icon + "</p>")
                            .append("<p>" + "Temperature: " + high + "</p>")   //add degress symbol
                            .append("<p>" + "Humidity: " + humidity + "%" + "</p>")
                    );

                }
            }
        })
    }

    function displaySidebar(subCity) {
        var cities = [];
        cities.push(subCity);
        console.log(cities.length);
        for (var i = 0; i < cities.length; i++) {
            console.log(cities);
            var cityList = $("<div>");
            var cityButton = $("<button>");
            var cityName = $("<p>");
            cityButton.css("width", "100%");
            cityButton.text(cities[i]);
            cityList.append(cityButton);
            cityName.text(cities[i]);
            $(cityButton).attr("id", cities[i]);
            $(".sidebar").append(cityList);
            localStorage.setItem("citiesArray", JSON.stringify(cities[i]));
        }

        $(cityButton).on("click", function (event) {

            // Preventing the button from trying to submit the form
            event.preventDefault();

            //initialize the page
            $(".city").empty();
            $("#forecast").empty();

            var subCity = event.target.id;
            console.log(subCity)
            var APIKey = "7321de3bce923134cdfb94c3f0188e62";

            // OpenWeather query for current weather with user imput and api key
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + subCity + "&units=imperial&appid=" + APIKey

            //declare and define date variables
            var longDate = new Date();
            console.log(longDate);
            var dd = longDate.getDate();
            var mm = longDate.getMonth() + 1;
            var yyyy = longDate.getFullYear();
            console.log(mm, dd, yyyy);

            //call functions for current weather and the five-day forecast
            //displaySidebar(subCity);
            getCurrentWeather(queryURL, dd, mm, yyyy);
            getForecast(subCity, APIKey, dd, mm, yyyy);
        });
    };
});