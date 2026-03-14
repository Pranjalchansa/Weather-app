document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (city === "") {
    alert("Enter city");
    return;
  }

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
  );

  const geoData = await geoResponse.json();

  if (!geoData.results) {
    alert("City not found");
    return;
  }

  const lat = geoData.results[0].latitude;
  const lon = geoData.results[0].longitude;

  fetchWeather(
    lat,
    lon,
    geoData.results[0].name + ", " + geoData.results[0].country,
  );
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const locationRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    );

    const locationData = await locationRes.json();

    let cityName =
      locationData.address.city ||
      locationData.address.town ||
      locationData.address.village ||
      locationData.address.state ||
      "Your Location";

    const country = locationData.address.country;

    cityName = cityName + ", " + country;

    fetchWeather(lat, lon, cityName);
  });
}

async function fetchWeather(lat, lon, city) {
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,pressure_msl,windspeed_10m,weathercode`,
  );

  const data = await weatherResponse.json();

  document.getElementById("cityName").innerText = city;
  document.getElementById("temperature").innerText =
    data.current.temperature_2m + "°C";
  document.getElementById("wind").innerText =
    data.current.windspeed_10m + " km/h";
  document.getElementById("humidity").innerText =
    data.current.relative_humidity_2m + "%";
  document.getElementById("uv").innerText = data.current.uv_index;
  document.getElementById("pressure").innerText =
    data.current.pressure_msl + " hPa";

  setAnimation(data.current.weathercode);
}

function setAnimation(code) {
  const bg = document.getElementById("weatherBg");
  bg.innerHTML = "";

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    for (let i = 0; i < 100; i++) {
      let drop = document.createElement("div");
      drop.className = "rain";
      drop.style.left = Math.random() * 100 + "%";
      drop.style.animationDuration = 0.5 + Math.random() + "s";
      bg.appendChild(drop);
    }

    document.getElementById("description").innerText = "Rainy";
  } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
    for (let i = 0; i < 80; i++) {
      let snow = document.createElement("div");
      snow.className = "snow";
      snow.style.left = Math.random() * 100 + "%";
      snow.style.animationDuration = 2 + Math.random() * 3 + "s";
      bg.appendChild(snow);
    }

    document.getElementById("description").innerText = "Snowy";
  } else if (code === 0) {
    let sun = document.createElement("div");
    sun.className = "sun";
    bg.appendChild(sun);

    document.getElementById("description").innerText = "Sunny";
  } else {
    let cloud = document.createElement("div");
    cloud.className = "cloud";
    bg.appendChild(cloud);

    document.getElementById("description").innerText = "Cloudy";
  }
}

for (let i = 0; i < 40; i++) {
  let particle = document.createElement("div");

  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDuration = 5 + Math.random() * 5 + "s";

  document.body.appendChild(particle);
}
