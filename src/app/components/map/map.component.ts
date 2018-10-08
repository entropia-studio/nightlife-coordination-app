import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @Input('lat') lat: number;
  @Input('lng') lng: number;
  @Input('mapZoom') mapZoom: number;  

  constructor(){      
  }
}
