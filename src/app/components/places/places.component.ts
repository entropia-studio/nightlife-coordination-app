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
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit{

  mPlaces = new Subject<Place[]>();
  mPlace$ = this.mPlaces.asObservable();

  places: Place[] = [];      
  markers: Marker[] = [];
  coordinates: Coordinates;
  markerIdSelected: number;
  elementSelected: string;
  map: any;
  user: User;
  modalRef: BsModalRef;
  goingTag: string;
  
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
      this.setGoingLabels();     
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
      this.setPeopleGoingToPlaces();  
    });   
  }

  setPeopleGoingToPlaces(){
    // Compare places from DB against places from Maps
    this.mPlace$.subscribe((places) => {        
      this.places = places;      
      this.db.getPlaces().subscribe(placesDB => {         
        places.map((place, index) => {                        
          placesDB.map((placeDB) => {              
            if (placeDB.placeId === place.id){              
              if (places[index].going.indexOf(placeDB.userId) < 0){
                this.places[index].going.push(placeDB.userId);                 
              } 
              // Add the _id from Mongo to this place
              places[index]._id = placeDB._id;             
            }
          })
        })
        this.setGoingLabels();                            
      })
    })
  }

  // Set the label to the field Going in every place  
  setGoingLabels(){
    if (!this.user){      
      return;
    }
    this.places.map((place,index) => {
      var elNum = this.places[index].going.length;      
      place.going.map(() => {
        this.places[index].goingLabel = elNum.toString();
        let i = this.places[index].going.indexOf(this.user.email);        
        if (i >= 0){
          if (elNum === 1){
            this.places[index].goingLabel = 'Me';
          }else{
            this.places[index].goingLabel = (elNum - 1 ) + ' and me';
          }    
        }        
      })
    })    
  }  

  markerClick(el: string, index: number) {
    // Avoid toogle when user clicks again
    if (this.markerIdSelected === index) return;
    
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
    this.db.addToPlace(place.id,this.user.email,this.coordinates.id)
      .subscribe(result => {        
        this.places.map((place,index) => {
          if (place.id === result.placeId){
            this.places[index].going.push(result.userId);
            this.mPlaces.next(this.places);           
            return;
          }
        })
    })    
  }

  // Remove user from place
  // Only is possible is the user previously has registered to this place
  removeToPlace(_id: string){        
    this.db.removeToPlace(_id)
      .subscribe(result => {                
        this.places.map((place,index) => {
          if (place._id === _id){
            // Search the index for the user within going array to remove it
            let i = this.places[index].going.indexOf(this.user.email);
            this.places[index].going.splice(i,1);
            this.places[index]._id = null;
            this.places[index].goingLabel = this.places[index].going.length.toString();
            this.mPlaces.next(this.places);            
            
            return;
          }
        })        
    })    
  }

  // Check if the user is going to a place
  // Toogle Add/Remove button
  userGoesToPlace(place: Place,user: User | null){    
    if (place.going.length == 0 || !user) return false;
    var sw = false;
    place.going.map(userEmail => {
      if (userEmail === user.email){        
        sw = true;
      } 
    })    
    return sw;
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
    var places = [];
    this.markers = [];

    // If it is not present the markers won't appear until fire an event on screen
    // It's perentory to work inside Angular zona to detect changes
    this.ngZone.run(() => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {              
        for (var i = 0; i < results.length; i++) {
          places.push({
            name      : results[i].name,
            // getUrl async fn, it's neccesary to set the image this way
            image      : results[i].photos ? results[i].photos[0].getUrl({maxWidth: 200,maxHeight: 112}) : results[i].icon,
            address    : results[i].vicinity,
            rating     : Number(results[i].rating),            
            id         : results[i].id,
            going      : [],
            goingLabel : '0',
            _id        : null           
          })    

          this.markers.push({
            lat       : Number(results[i].geometry.location.lat()),
            lng       : Number(results[i].geometry.location.lng()),
            animation : 'DROP',
            iconUrl   : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            id        : results[i].id 
          })               
        }  
        this.mPlaces.next(places);          
      }
      
    })        
  }

  // Shows de List button 
  isUserListShow(place: Place,user: User | null){    
    if (!user) return false;    
    let len = place.going.length;    
    return (len > 1 || (len === 0 && place.going.indexOf(user.email) >= 0));
  }

  // Launch modal with user list for this place
  userListShow(place: Place){
    
    
    var userList = [];
    
    place.going.map((user,i) => {      
      userList.push(user.split('@')[0]); 
    })
    
    const initialState = {
      userList,
      title: 'Who is going:'
    }
    this.modalRef = this.modalService.show(ModalContentComponent,{initialState});
    this.modalRef.content.closeBtnName = 'Close';
    
  }

}
