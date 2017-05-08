import { Component, OnInit } from '@angular/core'
import { GeolocationService } from '../geolocation/geolocation.service'
import 'leaflet'
import './leaflet-tileLayerPixelFilter.js'
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

    // set initial map options
    let tilelayer = L.tileLayerPixelFilter('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3', {
        matchRGBA: null,
        missRGBA:  [ 255, 255, 255, 255 ],
        //pixelCodes: [ [180, 0, 0] ],
        crossOrigin: true
    })
    this.options = {
      layers: [ tilelayer ],
      zoom: 2,
      center: L.latLng({ lat: 0, lng: 0 })
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

    }, (err) => {
      // error
    
    
    }, () => {
      // finally
    
    
    })

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
    setTimeout(() => {
      this.fitBounds = accuracyIndicatorLayer.getBounds()          // fit map's bound to accuracy indication
    })

  }     

}
