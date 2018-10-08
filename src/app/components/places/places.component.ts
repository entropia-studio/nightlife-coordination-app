import { Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import {} from '@types/googlemaps';
import { Place } from '../../interfaces/place';




@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent{

  places: Place[] = [];      
  coordinates: Coordinates;
  
  constructor(
    private ngZone: NgZone,
    ) {
    this.coordinates = {
      'lat'  : 39.5231711,
      'lng' : -0.4186977,
      'mapZoom' : 15
    }        
  }  
  

  scroll(el) {
    document.getElementById(el).scrollIntoView({behavior: "smooth"});
    //el.scrollIntoView({behavior: "smooth"});
    this.places[3].animation = 'BOUNCE';
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

  animateMarker(place: Place){
    console.log('Place click',place)
    this.places[3].animation = 'BOUNCE'
  }

  callback(results, status) {
    //console.log(results)
    // If it is not present the markers won't appear until fire an event on screen
    // It's perentory to work inside Angular zona to detect changes
    this.ngZone.run(() => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {      
        for (var i = 0; i < results.length; i++) {              
          let urlImage = results[i].photos ? results[i].photos[0].getUrl({maxWidth: 300}) : results[i].icon;          
          
          this.places.push({
            'name'      : results[i].name,
            'image'     : urlImage,
            'address'   : results[i].vicinity,
            'rating'    : Number(results[i].rating),
            'lat'       : Number(results[i].geometry.location.lat()),
            'lng'       : Number(results[i].geometry.location.lng()),
            'id'        : results[i].id,
            'animation' : 'DROP'
          })                   
        }              
      }
    })        
  }
}
