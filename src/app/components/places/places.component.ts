import { Component, OnInit, ViewChild, AfterContentInit, NgZone } from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import {} from '@types/googlemaps';
import { Place } from '../../interfaces/place';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, AfterContentInit {

  places: Place[] = [];
  map: any;
  //@ViewChild('agm-map', {read: ElementRef}) map: ElementRef;

  coordinates: Coordinates;
  
  constructor(private ngZone: NgZone) {
    this.coordinates = {
      'lat'  : 39.5231711,
      'lng' : -0.4186977,
      'mapZoom' : 15
    }
    
    // Current available space in navigator    
    this.currentHeight = window.innerHeight - this.navsHeight; 
  }

  currentHeight: number;
  navsHeight: number  = 106;

  ngOnInit() {
  }

  coordinatesChangedHandler = (coordinates: Coordinates) => {
    this.coordinates = coordinates;    
  }

  ngAfterContentInit(){
    //console.log('map',this.map.nativeElement)
  }

  mapReady(map: any){
    this.map = map;
    let places = new google.maps.places.PlacesService(map);
    
    //console.log('places',map)
    
    
    let place = {'lat': this.coordinates.lat,'lng': this.coordinates.lng};
    
    places.nearbySearch({
      location: place,
      radius: 500,
      type: 'bar'
    }, this.callback.bind(this))      
    
    
  }

  callback(results, status) {
    
    
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      
      for (var i = 0; i < results.length; i++) {
        console.log(results[i])
        this.places.push({
          'name'    : results[i].name,
          'image'   : results[i].icon,
          'address' : results[i].vicinity,
          'rating'  : results[i].rating,
          'lat'     : results[i].geometry.location.lat(),
          'lng'     : results[i].geometry.location.lng(),
        })
         
        //this.createMarker(results[i]);

      }
      //this.places = placesArr;
      console.log(this.places)
    }
  }

  createMarker(place) {
    console.log('place: ',this.places)
    /*
    this.places.push({
      'name'    : place.name,
      'image'   : place.icon,
      'address' : place.vicinity,
      'rating'  : place.rating
    })
    */
    /*
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });
    /*
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
    */
  }




}
