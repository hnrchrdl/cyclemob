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

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {

    let baseLayer = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3', {
      attribution: 'Map tiles by <a href="thunderforest.com">Thunderforest</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    })

    this.options = {
      layers: [ baseLayer ],
      zoom: 11,
      center: L.latLng({ lat: 40, lng: 15 })
    }

    // set inital layers
    this.layers = []

    // subscribe to location changes
    this.geolocationService.location.subscribe((position) => {
      // success
      let { lat, lng, accuracy } = position
      let currPosition = L.latLng({ lat, lng })
      this.center = currPosition        // center map
      this.showPosition(currPosition, accuracy)  // create layer
    })

    this.geolocationService.updateLocation();

  }

  showPosition(pos: L.LatLng, accuracy: number) {

    let positionMarkerLayer = L.marker(pos, {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
      })
    });
    let accuracyIndicatorLayer = L.circle(pos, { radius: accuracy })

    this.layers = [positionMarkerLayer, accuracyIndicatorLayer]    // add layers to map

  }

}
