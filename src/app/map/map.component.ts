import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  constructor() { }

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3', 
      { maxZoom: 18, 
        attribution: "Maps © Thunderforest, Data © OpenStreetMap contributors" }) 
    ],
    zoom: 5,
    center: L.latLng({ lat: 38.991709, lng: -76.886109 })
  };

  ngOnInit() {
  }

}
