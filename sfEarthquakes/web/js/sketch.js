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
var centerLatitudeDegrees = 47.115
var centerLongitudeDegrees = -101.300278
var zoom = 1.5

var placeData = {
    locality:"",
    place:"",
    country:""
}

var cnv


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
    WINDOW_HEIGHT = round((9*WINDOW_WIDTH)/16);

    switch (regionID) {
        case -1:
            zoom = 1.3
            break;
        case 0:
            centerLatitudeDegrees = 53.5775
            centerLongitudeDegrees = 23.106111
            zoom = 3.1
            break;
        case 1:
            centerLatitudeDegrees = 52.483333
            centerLongitudeDegrees = 96.085833
            zoom = 2.0
            break;
        case 2:
            centerLatitudeDegrees = 47.115
            centerLongitudeDegrees = -101.300278
            zoom = 1.5
            break;
        case 3:
            centerLatitudeDegrees = -15.595833
            centerLongitudeDegrees = -56.096944
            zoom = 2.0
            break;
        case 4:
            centerLatitudeDegrees = 5.65
            centerLongitudeDegrees = 26.17
            zoom = 2.4
            break;
        case 5:
            centerLatitudeDegrees = -23.116667
            centerLongitudeDegrees = 132.133333
            zoom = 2.5
            break;
        default:
    }

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
    // placeData.locality = geocodingData.features[0].context[0].text
    // placeData.place = geocodingData.features[0].context[1].text
    // placeData.country = geocodingData.features[0].context[3].text
}

function layout(mapi) {
    background(0)
    translate(width/2, height/2)
    image(mapi, 0, 0)

    fill(255,50,50, 150)
    noStroke()

    var counter = 0
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
    print('Shown earthquakes: %s of total %s', counter, earthquakes.length)

}

function setup() {
    cnv = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    cnv.parent('sketch-holder');


    imageMode(CENTER)
    layout(mapImage)


    frameRate(10)
    //centerCanvas()


    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCan, false);
    function resizeCan() {

        WINDOW_WIDTH = windowWidth
        WINDOW_HEIGHT = round((9*WINDOW_WIDTH)/16);
        resizeCanvas(WINDOW_WIDTH, round((9*WINDOW_WIDTH)/16));

        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */

        var lat = centerLatitudeDegrees
        var lon = centerLongitudeDegrees
        loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/'+lon.toString()+','+lat.toString()+','+zoom.toString()+',0,0/'+WINDOW_WIDTH.toString()+'x'+WINDOW_HEIGHT.toString()+'?access_token=' + MY_ACCESS_TOKEN, function(img) {
            layout(img)
        })

    }

    //MARK: - Printing info.
    // push()
    // textSize(15)
    // fill(255)
    // var txt = 'Latitude: '+centerLatitudeDegrees.toString()+'\n'+
    //     'Longitude: '+centerLongitudeDegrees.toString()+'\n'+
    //     'Name: '+placeData.locality+', '+placeData.place+', '+placeData.country+'\n'+
    //     'Zoom: '+zoom.toString()+'x\n'
    // text(txt, 15-width/2, 33-height/2)
    // var txtWidth = textWidth(txt)
    // pop()
    // push()
    // fill(255,255,255,50)
    // stroke(255)
    // strokeWeight(1)
    // rect(5-width/2, 10-height/2, 300, 95, 10)
    // pop()

    //MARK: - Center indicator.
    // if (zoom >= 3) {
    //     push()
    //     fill(255)
    //     ellipse(0, 0, 10)
    //     pop()
    // }

}


function draw() {

}