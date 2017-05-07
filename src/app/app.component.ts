import { Component } from '@angular/core'
import { GeolocationService } from './geolocation/geolocation.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Cyclemob'

  constructor(
  	private geolocationService: GeolocationService
  ) {}

  locateUser() {
  	this.geolocationService.updateLocation();
  }

}
