import { Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';
import {} from '@types/googlemaps';
import { Place } from '../../interfaces/place';
import { Marker } from '../../interfaces/marker';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/interfaces/user';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit{

  places: Place[] = [];      
  markers: Marker[] = [];
  coordinates: Coordinates;
  markerIdSelected: number;
  elementSelected: string;
  map: any;
  user: User;
  modalRef: BsModalRef;
  
  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private auth: AuthService,
    private modalService: BsModalService,
    private db: DatabaseService,
  ){}   
  
  ngOnInit(){    
    
    this.auth.navState$.subscribe( (user)=> {
      this.user = user;             
    });

    this.route.queryParamMap.subscribe(params => {
        this.coordinates = {
          lat : +params.get('lat'),
          lng : +params.get('lng'),
          id  : params.get('placeId'),
          mapZoom : 15
        }      
        if (this.map){
          this.searchPlaces();
        }   
      });            
  }

  markerClick(el: string, index: number) {
    // Scroll to the element
    document.getElementById(el).scrollIntoView({behavior: "smooth"});
    // Style selected list
    document.getElementById(el).className += ' bg-dark text-light';            
    // Unmark the marker
    // Unstyle list
    if (+this.markerIdSelected >= 0){
      this.markers[this.markerIdSelected].iconUrl = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'  
      document.getElementById(this.elementSelected).className = 'list-unstyled';            
    }
    this.markerIdSelected = index;
    this.elementSelected = el;
    
    this.markers[index] = this.setMarker(index);
    
    setTimeout(() => {
      this.markers[index].animation = null;
    }, 1000);    
  }

  // Toggle the marker to active and bounce
  setMarker(index: number): Marker{
    return {
      lat       : this.markers[index].lat,
      lng       : this.markers[index].lng,
      id        : this.markers[index].id, 
      animation : 'BOUNCE',
      iconUrl   : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };    
  }

  coordinatesChangedHandler = (coordinates: Coordinates) => {
    this.coordinates = coordinates;    
  }

  addToPlace(place: Place){    
    if (!this.user){
      this.modalRef = this.modalService.show(LoginComponent);
      return;
    }
    this.db.addToPlace(place,this.user);
    console.log('place',place)
  }


  mapReady(map: any){    
    this.map = map;
    this.searchPlaces();
  }

  searchPlaces(){
    let places = new google.maps.places.PlacesService(this.map);    
    let place = {'lat': this.coordinates.lat,'lng': this.coordinates.lng};     
    places.nearbySearch({
      location: place,
      radius: 750,
      type: 'bar',      
    }, this.callback.bind(this))          
  }  

  callback(results, status) {
    this.places = [];
    this.markers = [];

    // If it is not present the markers won't appear until fire an event on screen
    // It's perentory to work inside Angular zona to detect changes
    this.ngZone.run(() => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {      
        //console.log(results)
        for (var i = 0; i < results.length; i++) {
          this.places.push({
            name      : results[i].name,
            // getUrl async fn, it's neccesary to set the image this way
            image     : results[i].photos ? results[i].photos[0].getUrl({maxWidth: 200,maxHeight: 112}) : results[i].icon,
            address   : results[i].vicinity,
            rating    : Number(results[i].rating),            
            id        : results[i].id            
          })    

          this.markers.push({
            lat       : Number(results[i].geometry.location.lat()),
            lng       : Number(results[i].geometry.location.lng()),
            animation : 'DROP',
            iconUrl   : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            id        : results[i].id 
          })               
        }              
      }
    })        
  }
}
