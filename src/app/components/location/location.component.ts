import { Component} from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {

  coordinates: Coordinates;   

  constructor() {
    this.coordinates = {
      'lat'  : 51.678418,
      'lng' : 7.809007,
      'mapZoom' : 10
    }
  }  

  coordinatesChangedHandler = (coordinates: Coordinates) => {
    this.coordinates = coordinates;    
  }



}
