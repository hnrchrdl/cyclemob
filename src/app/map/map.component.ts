import { Component, OnInit } from '@angular/core'
import { GeolocationService } from '../geolocation/geolocation.service'
import 'leaflet'
declare var L; // avoid typescript errors with pixel filter lib

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  options: L.MapOptions      // inital leaflet options
  center: L.LatLng           // map center binding
  zoom: number               // zoom binding
  layers: L.Layer[]          // layers binding
  fitBounds: L.LatLngBounds  // map bounds binding
  map: L.Map;

  altitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  currPosition: L.LatLng;
  positionMarkerLayer: L.Marker;
  accuracyIndicatorLayer: L.Circle;

  route: L.GeoJSON;
  routeDistance: number;
  routeDuration: string;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {

    let baseLayer = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3', {
      attribution: 'Map tiles by <a href="thunderforest.com">Thunderforest</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    })

    this.options = {
      layers: [ baseLayer ],
      zoom: 11,
      center: L.latLng({ lat: 50, lng: 15 })
    }

    this.layers = []

    this.geolocationService.location.subscribe(({ latitude, longitude, accuracy, altitude, speed, heading }) => {
      let currPosition = L.latLng({ lat: latitude, lng: longitude })
      this.center = currPosition        // center map
      this.showPosition(currPosition, accuracy)  // create layer
      this.altitude = altitude ? Math.round(altitude) : null;
      this.speed = speed ? Math.round(speed * 3.6 * 10) / 10 : 0.0;
      this.heading = heading;
      this.accuracy = accuracy;
      this.currPosition = currPosition;
    })

    this.geolocationService.updateLocation();
  }

  onMapReady = (map) => {
    this.map = map;
    L.control.scale({ imperial: false}).addTo(this.map);
    this.map.on('zoomend', this.onZoomEnd)
    this.map.on('contextmenu', this.onMapLongpress)
  }

  showPosition = (pos: L.LatLng, accuracy: number) => {

    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconSize = [ 25, 41 ];
    const iconAnchor = [ 13, 41 ];
    const icon = L.icon({
      iconUrl,
      shadowUrl,
      iconSize,
      iconAnchor,
    });

    if(!this.positionMarkerLayer) {
      this.positionMarkerLayer = L.marker(pos, {
        icon
      });
      this.accuracyIndicatorLayer = L.circle(pos, { radius: accuracy })

      this.layers = [this.positionMarkerLayer, this.accuracyIndicatorLayer];  // add layers to map
    } else {
      this.positionMarkerLayer.setLatLng(pos);
      this.positionMarkerLayer.setIcon(icon);
      this.accuracyIndicatorLayer.setLatLng(pos);
      this.accuracyIndicatorLayer.setRadius(accuracy);
    }
  }

  onZoom = (level: number) => {
    if(this.zoom === level) {
      this.zoom = level + 1;
    } else {
      this.zoom = level;
    }
  }

  onToggleFollow = () => {
    if(this.isFollowing()) {
      this.heading = null;
      this.speed = null;
      this.altitude = null;
      this.showPosition(this.currPosition, this.accuracy)
    }
    this.geolocationService.toggleWatch();
  }

  isFollowing = () => {
    return Boolean(this.geolocationService.watcher);
  }

  onCenter = () => {
    this.geolocationService.updateLocation();
  }

  onZoomEnd = () => {
    this.zoom = this.map.getZoom();
  }

  onMapLongpress = (e) => {
    const target = e.latlng;
    this.geolocationService.getDirection(this.currPosition, target).then((data: any) => {
      if(data) {
        const summary = (data.features[0].properties.summary);
        this.routeDistance = Math.round(summary.distance / 1000 * 10) / 10 ;
        this.routeDuration = new Date(summary.duration * 1000).toISOString().substr(11, 8);
        if (this.route) {
          this.map.removeLayer(this.route)
        }
        this.route = L.geoJSON(data, {
          style: function (feature) {
              return {
                color: '#e74c3c',
                'width': 10,
                'opacity': 0.6,
              };
          }
        });
        this.route.addTo(this.map)
    }
    })
  }

  onRouteRemove = () => {
    this.map.removeLayer(this.route);
    this.route = null;
  }

}
