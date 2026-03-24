// elements
var container = document.getElementById("countriesContainer");
var searchInput = document.getElementById("searchInput");
var regionFilter = document.getElementById("regionFilter");
var sortOption = document.getElementById("sortOption");
var loading = document.getElementById("loading");
var error = document.getElementById("error");
var toggleBtn = document.getElementById("themeToggle");

var countriesData = [];

/* theme toggle */
toggleBtn.onclick = function () {
  document.body.classList.toggle("dark");
};

/* fetch data */
function fetchCountries() {
  loading.style.display = "block";
  error.style.display = "none";

  fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca2")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      countriesData = data;
      displayCountries(countriesData);
      loading.style.display = "none";
    })
    .catch(function () {
      loading.style.display = "none";
      error.style.display = "block";
      error.innerText = "Failed to load data";
    });
}

/* countries display */
function displayCountries(data) {
  container.innerHTML = "";

  for (var i = 0; i < data.length; i++) {
    var country = data[i];

    // skip broken data
    if (!country.name || !country.name.common) continue;

    var div = document.createElement("div");
    div.className = "country-card";

    // FLAG
    var img = document.createElement("img");
    img.className = "flag";

    var code = country.cca2;
    if (code) {
      img.src = "https://flagcdn.com/w320/" + code.toLowerCase() + ".png";
    } else {
      img.src = "https://flagcdn.com/w320/un.png";
    }

    // name
    var name = document.createElement("h3");
    name.innerText = country.name.common;

    // capital
    var capital = document.createElement("p");
    capital.innerText =
      "Capital: " +
      (country.capital && country.capital[0] ? country.capital[0] : "N/A");

    // region
    var region = document.createElement("p");
    region.innerText = "Region: " + (country.region || "N/A");

    // population
    var pop = document.createElement("p");
    pop.innerText = "Population: " + (country.population || "N/A");

    // append
    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(capital);
    div.appendChild(region);
    div.appendChild(pop);

    container.appendChild(div);
  }
}

/* filter, search, sort */
function applyFilters() {
  var filtered = countriesData;

  var text = searchInput.value.toLowerCase();

  // SEARCH
  filtered = filtered.filter(function (c) {
    var name =
      c.name && c.name.common ? c.name.common.toLowerCase() : "";
    var capital =
      c.capital && c.capital[0] ? c.capital[0].toLowerCase() : "";

    return name.includes(text) || capital.includes(text);
  });

  // region
  var region = regionFilter.value;
  if (region !== "") {
    filtered = filtered.filter(function (c) {
      return c.region === region;
    });
  }

  // sorting
  if (sortOption.value === "name-asc") {
    filtered.sort(function (a, b) {
      return a.name.common.localeCompare(b.name.common);
    });
  }

  if (sortOption.value === "name-desc") {
    filtered.sort(function (a, b) {
      return b.name.common.localeCompare(a.name.common);
    });
  }

  if (sortOption.value === "pop-asc") {
    filtered.sort(function (a, b) {
      return (a.population || 0) - (b.population || 0);
    });
  }

  if (sortOption.value === "pop-desc") {
    filtered.sort(function (a, b) {
      return (b.population || 0) - (a.population || 0);
    });
  }

  displayCountries(filtered);
}

/* events */
searchInput.oninput = applyFilters;
regionFilter.onchange = applyFilters;
sortOption.onchange = applyFilters;

/* start */
fetchCountries();