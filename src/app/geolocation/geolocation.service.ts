import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class GeolocationService {

	location: any = new Subject()
	watcher;

	constructor() { }

	watchPosition() {
		this.watcher = navigator.geolocation.watchPosition(({coords, timestamp}) => {
			// console.log(coords);
			let { latitude: lat, longitude: lng, accuracy } = coords
			this.location.next({lat, lng, accuracy});

			// cache nearby vector tiles if accuracy is within 10km
			// if (!window['tilesCached'] && coords.accuracy <= window['cacheRadius']) {
			// 	window['requestTiles'](window['tileSrc'], window['tileLayer'].createTile(coords), window['zoomRangeCache']);
			// 	window['tilesCached'] = true;
			//  }
		})
	}

	clearWatch() {
		if(this.watcher) {
			// console.log('unwatch');
			navigator.geolocation.clearWatch(this.watcher);
			this.watcher = undefined;
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

	  toggleWatch() {
		  this.watcher ? this.clearWatch() : this.watchPosition();
	  }

}
