(function () {
  'use strict';

  var TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  var TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  var places = [
    { name: 'Zion National Park',              lat: 37.2982,  lng: -113.0263 },
    { name: 'Yosemite National Park',          lat: 37.8651,  lng: -119.5383 },
    { name: 'Death Valley National Park',      lat: 36.5054,  lng: -117.0794 },
    { name: 'Sequoia National Park',           lat: 36.4864,  lng: -118.5658 },
    { name: 'Sedona, Arizona',                 lat: 34.8697,  lng: -111.7609 },
    { name: 'Petrified Forest National Park',  lat: 34.9823,  lng: -109.7785 },
    { name: 'New River Gorge National Park',   lat: 37.9919,  lng: -81.0803  },
    { name: 'Everglades National Park',        lat: 25.2866,  lng: -80.8987  },
    { name: 'Great Smoky Mountains NP',        lat: 35.6118,  lng: -83.4895  },
    { name: 'Redwood National Park',           lat: 41.2132,  lng: -124.0046 },
    { name: 'Joshua Tree National Park',       lat: 33.8734,  lng: -115.9010 },
    { name: 'Capitol Reef National Park',      lat: 38.0877,  lng: -111.1764 },
    { name: 'Bryce Canyon National Park',      lat: 37.5930,  lng: -112.1871 },
    { name: 'Grand Canyon National Park',      lat: 36.0544,  lng: -112.2401 },
    { name: 'Arches National Park',            lat: 38.7331,  lng: -109.5925 },
    { name: 'Canyonlands National Park',       lat: 38.2000,  lng: -109.9025 },
    { name: 'Moab, Utah',                      lat: 38.5733,  lng: -109.5498 },
    { name: 'Page, Arizona',                   lat: 36.9147,  lng: -111.4558 },
    { name: 'Flagstaff, Arizona',              lat: 35.1983,  lng: -111.6513 },
    { name: 'Monument Valley',                 lat: 36.9833,  lng: -110.1126 },
    { name: 'Valley of Fire State Park',       lat: 36.4825,  lng: -114.5228 },
    { name: 'Hocking Hills State Park',        lat: 39.4414,  lng: -82.5238  },
    { name: 'Red River Gorge',                 lat: 37.7918,  lng: -83.6824  },
    { name: 'Gateway Arch National Park',      lat: 38.6247,  lng: -90.1848  },
    { name: 'Mount Whitney',                   lat: 36.5785,  lng: -118.2923 },
  ];

  function isDark() {
    var t = document.documentElement.dataset.theme;
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function makeTileLayer(dark) {
    return L.tileLayer(dark ? TILE_DARK : TILE_LIGHT, {
      attribution: ATTR,
      subdomains: 'abcd',
      maxZoom: 19
    });
  }

  var map = L.map('map').setView([37.5, -110], 4);
  var currentTile = makeTileLayer(isDark()).addTo(map);

  places.forEach(function (p) {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup('<strong>' + p.name + '</strong>');
  });

  /* Dynamically switch tiles when theme changes */
  var observer = new MutationObserver(function () {
    var dark = isDark();
    map.removeLayer(currentTile);
    currentTile = makeTileLayer(dark).addTo(map);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}());
