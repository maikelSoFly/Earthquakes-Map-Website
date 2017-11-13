var mapImage
var earthquakesCSV
var MY_ACCESS_TOKEN = 'pk.eyJ1IjoiZGF0Ym9paW1haWtlbCIsImEiOiJjajh1ZDN3OGoweXZtMnFxdTFsMHY5cWV4In0.Vrbt1n6e5ZPzJZNq7RkkEA'
var MAG_MAX = Math.sqrt(Math.pow(10, 10))
var MIN_MAG_TO_SHOW = 0
var centerLatitude // in radians.
var centerLongitude // in radians.

// Window size
var WINDOW_WIDTH
var WINDOW_HEIGHT

// ZOOM TO THIS COORDINATES:
var centerLatitudeDegrees = 37.77493
var centerLongitudeDegrees = -122.41942
var zoom = 2

var placeData = {
    locality:"",
    place:"",
    country:""
}

var cnv
function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = 56
    cnv.position(x, y);
}

function windowResized() {
    centerCanvas();
}

// Merc stands for Mercator Projection.
// mercX and mercY calculates "world coordinates".
function mercX(longitude, zoom) {
    longitude = radians(longitude)
    return (256/PI) * pow(2, zoom) * (longitude + PI)
}

function mercY(latitude, zoom) {
    latitude = radians(latitude)
    return (256/PI) * pow(2, zoom) * (PI - log(tan(PI/4 + latitude/2)))
}

function preload() {
    // Fullscreen
    WINDOW_WIDTH = windowWidth
    WINDOW_HEIGHT = windowHeight - 130;

    centerLongitude = mercX(centerLongitudeDegrees, zoom)
    centerLatitude = mercY(centerLatitudeDegrees, zoom)

    var lat = centerLatitudeDegrees
    var lon = centerLongitudeDegrees


    // MapBox API request for world map.
    mapImage = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/'+lon.toString()+','+lat.toString()+','+zoom.toString()+',0,0/'+WINDOW_WIDTH.toString()+'x'+WINDOW_HEIGHT.toString()+'?access_token=' + MY_ACCESS_TOKEN)

    // USGS.gov request for earthquakes data.
    earthquakes = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.csv')

    // MapBox API request for Geocodin Data.
    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+lon.toString()+','+lat.toString()+'.json?access_token='+MY_ACCESS_TOKEN
    var geocodingData = loadJSON(url, retrieveData)
}

function retrieveData(geocodingData) {
    placeData.locality = geocodingData.features[0].context[0].text
    placeData.place = geocodingData.features[0].context[1].text
    placeData.country = geocodingData.features[0].context[3].text
}

function setup() {
    cnv = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    translate(width/2, height/2)
    imageMode(CENTER)
    image(mapImage, 0, 0)
    frameRate(30)
    centerCanvas()

    var counter = 0

    fill(255,0,0, 150)
    noStroke()
    for (var i = 0; i < earthquakes.length; i++) {
        var data = earthquakes[i].split(/,/)
        if (data[4] > MIN_MAG_TO_SHOW) {
            var x = mercX(data[2], zoom) - centerLongitude
            var y = mercY(data[1], zoom) - centerLatitude

            //MARK: - Reversing logarithm.
            magnitude = sqrt(pow(10, data[4]))

            var d = map(magnitude, 0, MAG_MAX, 1*zoom, 250*zoom)
            ellipse(x, y, d)
            counter += 1
        }
    }

    //MARK: - Printing info.
    push()
    textSize(15)
    fill(255)
    var txt = 'Latitude: '+centerLatitudeDegrees.toString()+'\n'+
        'Longitude: '+centerLongitudeDegrees.toString()+'\n'+
        'Name: '+placeData.locality+', '+placeData.place+', '+placeData.country+'\n'+
        'Zoom: '+zoom.toString()+'x\n'
    text(txt, 15-width/2, 33-height/2)
    var txtWidth = textWidth(txt)
    pop()
    push()
    fill(255,255,255,50)
    stroke(255)
    strokeWeight(1)
    rect(5-width/2, 10-height/2, 300, 95, 10)
    pop()

    //MARK: - Center indicator.
    if (zoom >= 3) {
        push()
        fill(255)
        ellipse(0, 0, 10)
        pop()
    }

    print('Shown earthquakes: %s of total %s', counter, earthquakes.length)

}



function draw() {

}
