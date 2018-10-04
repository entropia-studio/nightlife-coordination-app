import { Component, OnInit, NgZone} from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import {} from '@types/googlemaps';
import { Place } from '../../interfaces/place';



@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent {

  places: Place[] = [];      
  coordinates: Coordinates;
  currentHeight: number;
  navsHeight: number  = 106;
  
  constructor(private ngZone: NgZone) {
    this.coordinates = {
      'lat'  : 39.5231711,
      'lng' : -0.4186977,
      'mapZoom' : 15
    }    
    // Current available space in navigator    
    this.currentHeight = window.innerHeight - this.navsHeight; 
  }  

  coordinatesChangedHandler = (coordinates: Coordinates) => {
    this.coordinates = coordinates;    
  }


  mapReady(map: any){    
    let places = new google.maps.places.PlacesService(map);    
    let place = {'lat': this.coordinates.lat,'lng': this.coordinates.lng}; 
    
    places.nearbySearch({
      location: place,
      radius: 500,
      type: 'bar',      
    }, this.callback.bind(this))          
  }

  callback(results, status) {
    console.log(results)
    // If it is not present the markers won't appear until fire an event on screen
    // It's perentory to work inside Angular zona to detect changes
    this.ngZone.run(() => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      
        for (var i = 0; i < results.length; i++) {              
          let urlImage = results[i].photos ? results[i].photos[0].getUrl({maxWidth: 300}) : results[i].icon;
          if (results[i].photos){
            console.log(results[i].photos[0].getUrl({maxWidth: 640}))
          }
          
          this.places.push({
            'name'    : results[i].name,
            'image'   : urlImage,
            'address' : results[i].vicinity,
            'rating'  : Number(results[i].rating),
            'lat'     : Number(results[i].geometry.location.lat()),
            'lng'     : Number(results[i].geometry.location.lng()),
          })                   
        }              
      }
    })        
  }
}
