import { Component, OnInit, ElementRef, ViewChild,NgZone, Output, EventEmitter } from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';


@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})

export class SearchboxComponent implements OnInit {

  @ViewChild('search') public searchElement: ElementRef;  

  @Output() coordinatesChanged: EventEmitter<Coordinates> = new EventEmitter();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
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
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng(); 
            // Communicate with the parent
            this.coordinatesChanged.emit({'lat': lat, 'lng': lng, 'mapZoom': 15});                               
            });
        });        
      }
    )   
  }
}
