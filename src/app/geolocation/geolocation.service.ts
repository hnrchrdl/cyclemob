import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class GeolocationService {

	location: any = new Subject()
	watcher: any;
	updatingLocation = new Subject();

	key = '5b3ce3597851110001cf62487a38cbfb00b143529d810eb788844d8d';
	apiBase = 'https://api.openrouteservice.org';

	constructor() { }

	watchPosition = () => {
		if ("geolocation" in navigator) {

			let options = {
				enableHighAccuracy: true
			}
			this.watcher = navigator.geolocation.watchPosition(({coords, timestamp}) => {
				this.location.next(coords);

				// cache nearby vector tiles if accuracy is within 10km
				// if (!window['tilesCached'] && coords.accuracy <= window['cacheRadius']) {
				// 	window['requestTiles'](window['tileSrc'], window['tileLayer'].createTile(coords), window['zoomRangeCache']);
				// 	window['tilesCached'] = true;
				//  }
			}, (e) => {
				console.error('Error watching position', e)
			}, options)
		} else {
			alert('Your browser does not support geolocation')
		}
	}

	clearWatch = () => {
		if(this.watcher) {
			// console.log('unwatch');
			navigator.geolocation.clearWatch(this.watcher);
			this.watcher = undefined;
		}
	}

  	updateLocation = () => {
  		if ("geolocation" in navigator) {
			  this.updatingLocation.next(true);
			let options = {
				enableHighAccuracy: true
			}
			navigator.geolocation.getCurrentPosition(({ coords, timestamp }) => {
				this.location.next(coords);
				this.updatingLocation.next(false);
			}, (e) => {
				alert('Error getting gelocation: ' + e);
				this.updatingLocation.next(false);
			}, options)

		} else {
			alert('Your browser does not support geolocation')
		}
	  }

	  toggleWatch = () => {
		  this.watcher ? this.clearWatch() : this.watchPosition();
	  }

	  getDirection = (start: {lat: number, lng: number }, end: {lat: number, lng: number }, mode = 'cycling-regular') => {
		const url = `${this.apiBase}/v2/directions/${mode}?api_key=${this.key}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
		return fetch(url).then(response => {
			if(response.ok) {
				return response.json();
			}
			return null;
		})
	  }

}
