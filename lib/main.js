// Center of the map
var center = [30, 0];
//59.89444, 30.26417
var click_lat = ''
var click_lng = ''
var xm = 0
var ym = 1
var count_of_click = 0
var player_1 = 0
var player_2 = 0
//var city_cords = [55.751244, 37.618423]
// Init the map
var map = L.map('map').setView(center, 2);


function getcity() {
    var http = new XMLHttpRequest();
    http.open("GET", "/cities", false);
    http.send(null);
    document.getElementById("city").innerHTML = JSON.parse(http.responseText).city
}


function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}


// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20}).addTo(map);



// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// define custom marker
var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(30, 30),
        iconUrl: 'https://schuv.mskobr.ru/files/MosSmena/Silaedr.png'
    }
});

var drawPluginOptions = {

position: 'topright',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10
            }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
        marker: {
            icon: new MyCustomMarker()
        }
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
    }
};
// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);


var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);


// Draw event
map.on('draw:created', function(e) {
    var type = e.layerType,
    layer = e.layer;

    // If a marker is added
    if (type === 'marker') {
        //if (count_of_click = 3) {
        //    count_of_click = 0
        //    change_rand()
        var http = new XMLHttpRequest();
        http.open("GET", "/cities", false);
        http.send(null);
        var city_lat = JSON.parse(http.responseText).lat
        var city_lng = JSON.parse(http.responseText).long
        // Print point coordinated
        //console.log(layer._latlng['lat'], layer._latlng['lng']);
        click_lat = layer._latlng['lat']
        click_lng = layer._latlng['lng']

        console.log(city_lat, city_lng)
        console.log(click_lat, click_lng)
        console.log(getDistance([city_lat, city_lng], [click_lat, click_lng]) / 1000)
        document.getElementById("dist").innerHTML = Math.round(getDistance([city_lat, city_lng], [click_lat, click_lng]) / 1000)
        count_of_click += 1
        if (count_of_click % 2 == 1){
            player_1 = Math.round(getDistance([city_lat, city_lng], [click_lat, click_lng]) / 1000)

        }
        else{
            player_2 = Math.round(getDistance([city_lat, city_lng], [click_lat, click_lng]) / 1000)
            if (player_1 > player_2){
                document.getElementById("winner").innerHTML = 'second player win'
                //if (count_of_click = 2) {
                //    change_rand()
            }
            else {
                document.getElementById("winner").innerHTML = 'first player win'
                    //if (count_of_click = 2) {
                    //    change_rand()
                    //}


            }
        }
        console.log(count_of_click)
        //console.log(getDistance([city_cords[0], city_cords[1]], [cords[0], cords[1]]) / 1000)


    }

    editableLayers.addLayer(layer);


});
getcity();