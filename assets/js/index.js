const cardTitleEl = $("#cardTitle");
const currentWeatherEl = $("#current");

function createEl(tag) {
  return $("<" + tag + ">");
}
function createItem(item) {
  return $("<li>")
    .addClass("collection-item")
    .text(item);
}

function createTab(tab, id) {
  let tabBut = $("<a>")
    .text(tab)
    .attr({ href: "#forecast" + id });
  let tabLi = createEl("li").addClass("tab");
  if (id === 4) {
    tabBut.addClass("active");
  }
  return tabLi.append(tabBut);
}

async function getWeather(query) {
  $.ajax({
    url:
      "https://api.weatherbit.io/v2.0/forecast/daily?city=" +
      query +
      "&days=6&key=6414e1f40de447d9941fd0c7e4c5cc11",
    method: "GET"
  }).then(function(response) {
    if (response != undefined) {
      let results = response.data;
      let cityName = response.city_name;
      let citySpan = createEl("span").text(cityName);
      let currentDate = createEl("span").text(results[0].valid_date);
      let weatherIcon = $("<img>")
        .attr({
          src:
            "https://www.weatherbit.io/static/img/icons/" +
            results[0].weather.icon +
            ".png"
        })
        .css({ width: "60px", float: "right" });

      let currentStats = $("<ul>");
      let temp = createItem(`Temperature: ${results[0].high_temp}°C`);
      let hum = createItem(`Humidity: ${results[0].rh}%`);
      let windsSpd = createItem(
        `Wind speed: ${results[0].wind_spd.toFixed(2)}m/s`
      );
      let uvInd = createItem(`UV index: ${results[0].uv.toFixed(2)}`);
      currentStats.append(temp, hum, windsSpd, uvInd);
      cardTitleEl.text(`${citySpan.text()} - ${currentDate.text()}`);
      cardTitleEl.append(weatherIcon);
      currentWeatherEl.text("");
      currentWeatherEl.append(currentStats);
      $("#tabs").text("");
      $("#forecast").text("");
      results.shift();
      let forecastTabs = createEl("div");

      results.forEach((result, index) => {
        date = createEl("span").text(result.valid_date);

        weatherIcon = $("<img>")
          .attr({
            src:
              "https://www.weatherbit.io/static/img/icons/" +
              result.weather.icon +
              ".png"
          })
          .css({ width: "60px", float: "right" });
        let forecastStats = $("<ul>");

        temp = createItem(`Temperature: ${result.high_temp}°C`);
        hum = createItem(`Humidity: ${result.rh}%`);

        forecastStats.append(temp, hum);
        let day = moment()
          .add(1 + index, "days")
          .format("dddd");

        $("#tabs").append(createTab(day, index));
        let tab = createEl("div").attr({ id: "forecast" + index });
        tab.append(date);
        tab.append(weatherIcon);
        tab.append(forecastStats);
        $("#forecast").append(tab);
      });
    }
    $(".tabs").tabs();
  });
}

function newWeather(query) {
  $(".tabs").tabs("destroy");
  getWeather(query);
}

function queryWeather(e) {
  e.preventDefault();

  let query = $("#first_name2").val();
  if (query !== "") {
    newWeather(query);
  }
}

$(document).ready(function() {
  let query = "melbourne,vic";
  $(".sidenav").sidenav();
  getWeather(query);
});

$("form").submit(queryWeather);
