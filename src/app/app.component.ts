import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild('search') public searchElement: ElementRef;

  title = 'Nightlife Coordination Life';  
  lat: number = 51.678418;
  lng: number = 7.809007;
  mapZoom: number = 10;
  currentHeight: number;
  navsHeight:number  = 106;
  


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
    ){
    // Current available space in navigator    
    this.currentHeight = window.innerHeight - this.navsHeight;    
  }

  ngOnInit(){ 
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
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();       
              this.mapZoom = 15;
            });
        });        

      }
    )   
  }
}
