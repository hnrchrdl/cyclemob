import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class GeolocationService {

	location: any = new Subject()

  	constructor() { }

  	updateLocation() {
  		
  		console.log('updating location')

  		if ("geolocation" in navigator) {
			/* geolocation is available */
			let options = {
				enableHighAccuracy: true
			}
			navigator.geolocation.getCurrentPosition((position) => {
				let { coords } = position
				let { latitude: lat, longitude: lng, accuracy } = coords
				this.location.next({lat, lng, accuracy})
			}, (err) => {
				alert('Error getting gelocation: ' + err)
			}, options)
			
		} else {
			/* geolocation IS NOT available */
			
			alert('Your browser does not support geolocation')
		}
  		
  	}

}
