import { Injectable } from '@angular/core';
import { appConfig } from 'src/environments/appConfig';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsHelpersService {

  minZoom: number = 7;
  maxZoom: number = 15;

  // Sets up a map element with default options, and returns it
  buildGoogleMap(mapDivId: string): google.maps.Map {
    // Create the Map with default settings
    let latLng = new google.maps.LatLng(appConfig.DEFAULT_LOCATION.lat, appConfig.DEFAULT_LOCATION.lng);
    let mapOptions = {
      center: latLng,
      zoom: appConfig.INITIAL_ZOOM_LEVEL,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    return new google.maps.Map(document.getElementById(mapDivId), mapOptions);
  }


  // Adds a your-location button to the map. Takes a map object and a callback
  // function that will accept the latlng of the current position, which is called
  // when that position is found by the geolocator.
  addYourLocationButton(map: any, onClickCallback: Function) {
    let controlDiv = document.createElement('div');
    let locationBoxElement = this.locationBox();
    let reticleElement = this.locationReticle();

    controlDiv.appendChild(locationBoxElement);
    locationBoxElement.appendChild(reticleElement);

    if (map != null) {
      locationBoxElement.addEventListener('click', function() {

        if(navigator.geolocation) {
          // Timeout if the geolocation takes too long.
          var options = {
            timeout: 5000,
          };
          navigator.geolocation.getCurrentPosition(function(position) {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(latLng);
            onClickCallback(latLng);
          },
          function(error) {
            console.error("The browser or device does not support geolocation.");
          },
          options);
        }
      });

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationBoxElement);
    }

    return locationBoxElement; // Return the location button so that event handlers can be added to it
  }

  // Creates a box for holding the location reticle
  locationBox() {
    var boxElement = document.createElement('locationButton');
    boxElement.style.backgroundColor = '#fff';
    boxElement.style.border = 'none';
    boxElement.style.outline = 'none';
    boxElement.style.width = '28px';
    boxElement.style.height = '28px';
    boxElement.style.borderRadius = '2px';
    boxElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    boxElement.style.cursor = 'pointer';
    boxElement.style.marginRight = '10px';
    boxElement.style.padding = '0px';
    boxElement.title = 'Your Location';
    return boxElement;
  }

  // Creates a location reticle icon
  locationReticle() {
    // Location reticle
    var reticleElement = document.createElement('div');
    reticleElement.style.margin = '5px';
    reticleElement.style.width = '18px';
    reticleElement.style.height = '18px';
    reticleElement.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    reticleElement.style.backgroundSize = '180px 18px';
    reticleElement.style.backgroundPosition = '0px 0px';
    reticleElement.style.backgroundRepeat = 'no-repeat';
    reticleElement.id = 'you_location_img';
    return reticleElement;
  }

  // create or update an arc (used to show travel from origin to destination without a specific route plotted)
  createUpdateArc(arc: google.maps.Marker, map: google.maps.Map, start: google.maps.LatLng, end: google.maps.LatLng): google.maps.Marker {
   
    var curvature = 0.5; // how curvy to make the arc
    var projection = map.getProjection();

    //check to be sure projection was found
    if (projection) {
      var p1 = projection.fromLatLngToPoint(start);
      var p2 = projection.fromLatLngToPoint(end);
    } else {
      console.error("No projection of map provided");
      return arc;
    }

    // Calculate the arc.
    // To simplify the math, these points 
    // are all relative to p1:
    var e = new google.maps.Point(p2.x - p1.x, p2.y - p1.y), // endpoint (p2 relative to p1)
        m = new google.maps.Point(e.x / 2, e.y / 2), // midpoint
        o = new google.maps.Point(e.y, -e.x), // orthogonal
        c = new google.maps.Point( // curve control point
            m.x + curvature * o.x,
            m.y + curvature * o.y);

    var pathDef = 'M 0,0 ' + 'q ' + c.x + ',' + c.y + ' ' + e.x + ',' + e.y;

    var zoom = map.getZoom(),
        scale = 1 / (Math.pow(2, -zoom));

        //create similar symbol as bus routes, driving routes
    var symbol = {
        path: pathDef,
        scale: scale,
        strokeColor: '#133182', // Lynx Dark Pink
        strokeOpacity: 0.7,
        strokeWeight: 6,
        fillColor: 'none'
    };

    // Create the polyline, passing the symbol in the 'icons' property.
    if (arc) {//arc already exists so just adjust the existing one
      arc.setOptions({
        position: start,
        icon: symbol,
    });
    }
    else {//new arc is created
      arc = new google.maps.Marker({
          position: start,
          clickable: false,
          icon: symbol,
          zIndex: 0, // behind the other markers
      });
    }

    return arc;
  }

  // Builds a routeline with default formatting, and returns it. Takes an array
  // of google maps latlngs and a string of the leg's mode
  drawRouteLine(routePoints: google.maps.LatLng[],
                mode: string="BUS"): google.maps.Polyline {

    switch(mode) {

      // Solid Gray Line (because IE can't handle the dotted gray line)
      case 'WALK':
        return new google.maps.Polyline({
          path: routePoints,
          strokeColor: '#696969', // Lynx Dark Pink
          strokeOpacity: 0.7,
          strokeWeight: 6
        });

      // Solid Pink Line
      case 'CAR':
      case 'BUS':
      case 'TRAM':
      case 'SUBWAY':
      case 'BICYCLE':
      default:
        return new google.maps.Polyline({
          path: routePoints,
          strokeColor: '#133182', // Lynx Dark Pink
          strokeOpacity: 0.7,
          strokeWeight: 6
        });
    }

  }

  // Zooms map view to fit each object in the passed array.
  // Accepts a map and an array of objects to zoom to.
  zoomToObjects(map: google.maps.Map, objs: any[]): void {
    // Map objects to arrays of points, then flatten into a flat array of points
    let points:google.maps.LatLng[] = objs.map((obj):google.maps.LatLng[] => {
      if(obj instanceof google.maps.Polyline) {
        return obj.getPath().getArray();
      } else if(obj instanceof google.maps.Marker) {
        return [obj.getPosition()];
      } else if (obj instanceof google.maps.LatLng) {
        return [obj];
      } else {
        return [];
      }
    }).reduce((acc, cur) => acc.concat(cur), []);

    // Then, zoom the map to the array of points
    this.zoomToPoints(map, points);
  }

  // Zooms the passed map to the minimum box encompassing all of the passed latlngs
  zoomToPoints(map: google.maps.Map, points: google.maps.LatLng[]) {
    var bounds = new google.maps.LatLngBounds();

    //need to fit the map for each point otherwise the zoom gets screwed up
    //needs the timeout for some reason in-between the fitBounds or the zoom gets screwed up
    points.forEach((p) => {
      setTimeout(() => {
        bounds.extend(p);
        map.fitBounds(bounds);
      }, 1);
    });

    setTimeout(() => {
      map.setZoom(Math.min(map.getZoom(), this.maxZoom)); // reduce zoom to the max zoom if necessary
    }, 150 );
  }

  // Drops a pin at the given latLng
  dropUserLocationPin(map: google.maps.Map, latLng: google.maps.LatLng):google.maps.Marker {
    let marker = new google.maps.Marker;
    marker.setPosition(latLng);
    marker.setMap(map);
    marker.setTitle('Your Location');
    marker.setClickable(false);

    return marker;
  }

  // Add layer to map representing the participating counties.
  addParticipatingCountiesLayer(map: google.maps.Map) {
    map.data.loadGeoJson('assets/data/counties.geojson');
    map.data.setStyle({
      clickable: true,
      fillOpacity: 0,
      strokeColor: appConfig.PARTICIPATING_COUNTIES_BORDER_COLOR,
      strokeWeight: 1
    });
  }

}
