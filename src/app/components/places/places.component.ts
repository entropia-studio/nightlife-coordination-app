import { Component, OnInit } from '@angular/core';
import { Coordinates } from '../../interfaces/coordinates';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {

  coordinates: Coordinates;

  constructor() {
    this.coordinates = {
      'lat'  : 51.678418,
      'lng' : 7.809007,
      'mapZoom' : 10
    }
  }

  ngOnInit() {
  }

}
