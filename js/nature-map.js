(function () {
  'use strict';

  var DATA_URL = '/data/places.json';
  var TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var FILTERS = ['all', 'park', 'landmark', 'scenic'];
  var TYPE_LABELS = {
    park: 'National Park',
    landmark: 'Landmark',
    scenic: 'Scenic Place'
  };

  function escapeHtml(input) {
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isValidPlace(place) {
    return place &&
      typeof place.name === 'string' &&
      FILTERS.indexOf(place.type) !== -1 &&
      typeof place.lat === 'number' &&
      typeof place.lng === 'number';
  }

  function popupHtml(place) {
    var note = place.note ? '<div class="popup-note">' + escapeHtml(place.note) + '</div>' : '';
    return (
      '<div class="map-popup">' +
        '<strong>' + escapeHtml(place.name) + '</strong>' +
        '<div class="popup-type">' + TYPE_LABELS[place.type] + '</div>' +
        note +
      '</div>'
    );
  }

  function countByType(places, type) {
    if (type === 'all') return places.length;
    return places.filter(function (p) { return p.type === type; }).length;
  }

  function updateFilterLabels(buttons, places) {
    var total = places.length;
    var parks = countByType(places, 'park');
    var landmarks = countByType(places, 'landmark');
    var scenic = countByType(places, 'scenic');
    var parkProgress = Math.max(0, Math.min(100, (parks / 63) * 100));

    buttons.forEach(function (btn) {
      var filter = btn.getAttribute('data-filter');
      var labelEl = btn.querySelector('.label');

      if (!labelEl) return;

      if (filter === 'all') {
        labelEl.textContent = 'All (' + total + ')';
      }

      if (filter === 'park') {
        labelEl.textContent = 'National Parks (' + parks + '/63)';
        var meter = btn.querySelector('.map-meter-fill');
        if (meter) meter.style.width = parkProgress + '%';
      }

      if (filter === 'landmark') {
        labelEl.textContent = 'Landmarks (' + landmarks + ')';
      }

      if (filter === 'scenic') {
        labelEl.textContent = 'Scenic Places (' + scenic + ')';
      }
    });
  }

  function toggleMarkers(map, markers, filter) {
    markers.forEach(function (entry) {
      var show = filter === 'all' || entry.type === filter;
      if (show) {
        if (!map.hasLayer(entry.marker)) entry.marker.addTo(map);
      } else if (map.hasLayer(entry.marker)) {
        map.removeLayer(entry.marker);
      }
    });
  }

  function updateActive(buttons, activeFilter) {
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-filter') === activeFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function init() {
    var mapEl = document.getElementById('nature-map');
    if (!mapEl || typeof L === 'undefined') return;

    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-map-filter]'));

    fetch(DATA_URL)
      .then(function (resp) {
        if (!resp.ok) throw new Error('Failed to load places');
        return resp.json();
      })
      .then(function (places) {
        var validPlaces = Array.isArray(places) ? places.filter(isValidPlace) : [];
        var map = L.map('nature-map').setView([39.3, -98.5], 4);

        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTR,
          maxZoom: 19
        }).addTo(map);

        var bounds = [];
        var markers = validPlaces.map(function (place) {
          bounds.push([place.lat, place.lng]);
          var marker = L.marker([place.lat, place.lng]);
          marker.bindPopup(popupHtml(place));
          marker.addTo(map);
          return {
            type: place.type,
            marker: marker
          };
        });

        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [32, 32], maxZoom: 6 });
        }

        updateFilterLabels(buttons, validPlaces);
        updateActive(buttons, 'all');

        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter') || 'all';
            toggleMarkers(map, markers, filter);
            updateActive(buttons, filter);
          });
        });

        setTimeout(function () { map.invalidateSize(); }, 0);
      })
      .catch(function () {
        var status = document.getElementById('map-status');
        if (status) {
          status.textContent = 'Could not load map data right now. Please try again later.';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
