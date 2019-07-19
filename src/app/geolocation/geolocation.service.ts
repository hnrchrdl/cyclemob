import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class GeolocationService {

	location: any = new Subject()
	watcher;

	constructor() { }

	watchPosition() {
		this.watcher = navigator.geolocation.watchPosition(({coords, timestamp}) => {
			console.log(coords);
			let { latitude: lat, longitude: lng, accuracy } = coords
			this.location.next({lat, lng, accuracy})
		})
	}

	clearWatch() {
		if(this.watcher) {
			console.log('unwatch');
			navigator.geolocation.clearWatch(this.watcher);
		}
	}

  	updateLocation() {

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
