import { Component, OnInit } from '@angular/core'
import { GeolocationService } from '../geolocation/geolocation.service'
import 'leaflet'
import './TileLayer.Colorizr2.js'
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

    let baseLayer = L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    })
    let cyclingLayer = L.tileLayer.colorizr('http://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
      colorMappings: [{ 
          from:    { r: 0, g: 0, b: 0 }, // black
          to:      { r: 255, g: 255, b: 255 }, // white
          tolerance: 100
      // },{ 
      //     from:    { r: 178, g: 3, b: 3 }, // red
      //     to:      { r: 246, g: 36, b: 89 }, // radical red
      //     tolerance: 100
      // },{ 
      //     from:    { r: 21, g: 46, b: 236 }, // blue
      //     to:      { r: 246, g: 36, b: 89 }, // radical red
      //     tolerance:  100
      // },{
      },{ 
          from:    { r: 178, g: 3, b: 3 }, // red
          to:      { r: 231, g: 76, b: 60 }, // alizarin
          tolerance: 100
      },{ 
          from:    { r: 21, g: 46, b: 236 }, // blue
          to:      { r: 231, g: 76, b: 60 }, // alizarin
          tolerance: 110
      },{ 
        
          from:    { r: 219, g: 0, b: 219 }, // purple
          to:      { r: 241, g: 196, b: 15 }, // sun flower 
          tolerance:  110
      },{ 
          from:    { r: 255, g: 163, b: 4 }, // yellow 
          to:      { r: 230, g: 126, b: 34 }, // carrot
          tolerance:  110
      }],
      //colorMappings: [{from: { r: 178, g: 3, b: 3 }, to: {r: 0, g: 0, b: 0}, tolerance: 50                                                                                                                                                                                        <}],
      processTransparentPixels: false,
      defaultColor: {r:200,g:200,b:200, a: 255},
      // defaultColor: null,
      opacity: 0.9,
      attribution: 'Cycling tracks by <a href="waymarkedtrails.org">waymarkedtrails.org</a>'
    })
    // let cyclingLayer = L.tileLayer('http://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
    //   opacity: 0.7,
    //   attribution: 'Cycling tracks by <a href="waymarkedtrails.org">waymarkedtrails.org</a>'
    // })
    this.options = {
      layers: [ baseLayer, cyclingLayer ],
      zoom: 4,
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
      if(accuracy > 500) {
        this.fitBounds = accuracyIndicatorLayer.getBounds()          // fit map's bound to accuracy indication
      } else {
        this.zoom = 16
      }
    })

  }     

}
