// Define letiables for our base layers
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

function getColor(d) {
  return d > 90  ? '#ffffb2' :
         d > 70  ? '#fed976' :
         d > 50  ? '#feb24c' :
         d > 30  ? '#fd8d3c' :
         d > 10  ? '#f03b20' :
                  '#bd0026' ;
         
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {

    console.log(data)
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {

          console.log(latlng)
          let geojsonMarkerOptions = {
            radius: feature.properties.mag * 4,
            fillColor: getColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Magnitude: "
              + feature.properties.mag
              + "<br>Depth: "
              + feature.geometry.coordinates[2]
              + "<br>Location: "
              + feature.properties.place
          );
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

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      let div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 30, 50, 70, 90],
          labels = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + labels[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  }
  
  legend.addTo(myMap); 
});

// set up the legend
// legend = L.control({position: "bottomright"});
// legend.onAdd = function() {
//   let div = L.DomUtil.create("div", "info legend");
//   let limits = geojson.options.limits;
//   let colors = geojson.options.colors;
//   let labels = [];

//   let legendInfo = "<h1>"
// }
// )

