import { Component, OnInit, ElementRef, ViewChild,NgZone, Output, EventEmitter } from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import { MapsAPILoader } from '@agm/core';
import { Router, NavigationExtras } from '@angular/router';
import {} from '@types/googlemaps';


@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})

export class SearchboxComponent implements OnInit {

  @ViewChild('search') public searchElement: ElementRef;  

  @Output() coordinatesChanged: EventEmitter<Coordinates> = new EventEmitter();

  btnPlacesDisabled: boolean = true;
  coordinates: Coordinates;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router
    ){    
  }

  ngOnInit() {
    this.mapsAPILoader.load().then( () => {
        
      let autocomplete =  new google.maps.places.Autocomplete(
            this.searchElement.nativeElement,
            {types: ['geocode']}
      );        

      autocomplete.addListener('place_changed',() => {
          this.ngZone.run(() => {              
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null){
              return;
            }   
            this.btnPlacesDisabled = false;
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng(); 
            this.coordinates = {
              lat     : lat,
              lng     : lng, 
              id      : place.id,
              mapZoom : 15
            }
            // Communicate with the parent
            this.coordinatesChanged.emit(this.coordinates);                               
            });
        });        
      }
    )   
  }
  showPlaces(){
    let navigationExtras: NavigationExtras = {
      queryParams: { 
        'lat'     : this.coordinates.lat,
        'lng'     : this.coordinates.lng,
        'placeId' : this.coordinates.id
       },
       fragment: 'anchor'
    }
    this.router.navigate(['places/'],navigationExtras);
  }
}
