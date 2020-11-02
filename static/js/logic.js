// Define variables for our base layers
let streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
})
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: streetmap
    // layers: [streetmap, earthquakes]
});

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
    console.log(data)
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          console.log(latlng)
          let geojsonMarkerOptions = {
            radius: feature.properties.mag * 4
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(myMap);
// Define a baseMaps object to hold our base layers
let baseMaps = {
    "Street Map": streetmap
  };
  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };
  // Create a control to toggle different maps and earthquakes
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
    
})

