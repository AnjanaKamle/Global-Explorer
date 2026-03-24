window.onload = function () {

  var container = document.getElementById("countriesContainer");
  var searchInput = document.getElementById("searchInput");
  var regionFilter = document.getElementById("regionFilter");
  var sortOption = document.getElementById("sortOption");
  var loading = document.getElementById("loading");
  var error = document.getElementById("error");
  var toggleBtn = document.getElementById("themeToggle");

  var popup = document.getElementById("popup");
  var popupData = document.getElementById("popupData");
  var closePopup = document.getElementById("closePopup");

  var countriesData = [];

  // THEME
  if (toggleBtn) {
    toggleBtn.onclick = function () {
      document.body.classList.toggle("dark");
    };
  }

  // CLOSE POPUP (SAFE)
  if (closePopup) {
    closePopup.onclick = function () {
      popup.classList.add("hidden");
    };
  }

  // FETCH
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

  // DISPLAY
  function displayCountries(data) {
    container.innerHTML = "";

    for (var i = 0; i < data.length; i++) {
      var country = data[i];

      if (!country.name || !country.name.common) continue;

      var div = document.createElement("div");
      div.className = "country-card";

      div.onclick = (function (c) {
        return function () {
          showPopup(c);
        };
      })(country);

      var img = document.createElement("img");
      img.className = "flag";

      var code = country.cca2;
      img.src = code
        ? "https://flagcdn.com/w320/" + code.toLowerCase() + ".png"
        : "https://flagcdn.com/w320/un.png";

      var name = document.createElement("h3");
      name.innerText = country.name.common;

      var capital = document.createElement("p");
      capital.innerText =
        "Capital: " +
        (country.capital && country.capital[0] ? country.capital[0] : "N/A");

      // var region = document.createElement("p");
      // region.innerText = "Region: " + (country.region || "N/A");

      // var pop = document.createElement("p");
      // pop.innerText =
      //   "Population: " +
      //   (country.population ? country.population.toLocaleString() : "N/A");

      div.appendChild(img);
      div.appendChild(name);
      div.appendChild(capital);
      // div.appendChild(region);
      // div.appendChild(pop);

      container.appendChild(div);
    }
  }

  // FILTER
  function applyFilters() {
    var filtered = countriesData;

    var text = searchInput.value.toLowerCase();

    filtered = filtered.filter(function (c) {
      var name = c.name && c.name.common ? c.name.common.toLowerCase() : "";
      var capital = c.capital && c.capital[0] ? c.capital[0].toLowerCase() : "";

      return name.includes(text) || capital.includes(text);
    });

    var region = regionFilter.value;
    if (region !== "") {
      filtered = filtered.filter(function (c) {
        return c.region === region;
      });
    }

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

  // POPUP
  function showPopup(country) {
    popup.classList.remove("hidden");

    popupData.innerHTML = "";

    var name = document.createElement("h2");
    name.innerText = country.name.common;

    var capital = document.createElement("p");
    capital.innerText =
      "Capital: " +
      (country.capital && country.capital[0] ? country.capital[0] : "N/A");

    var region = document.createElement("p");
    region.innerText = "Region: " + (country.region || "N/A");

    var population = document.createElement("p");
    population.innerText =
      "Population: " +
      (country.population ? country.population.toLocaleString() : "N/A");

    popupData.appendChild(name);
    popupData.appendChild(capital);
    popupData.appendChild(region);
    popupData.appendChild(population);
  }

  // EVENTS
  searchInput.oninput = applyFilters;
  regionFilter.onchange = applyFilters;
  sortOption.onchange = applyFilters;

  // START
  fetchCountries();
};