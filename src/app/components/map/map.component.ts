import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input('lat') lat: number;
  @Input('lng') lng: number;
  @Input('mapZoom') mapZoom: number;  
  
  currentHeight: number;
  navsHeight: number  = 106;

  constructor(){
    // Current available space in navigator    
    this.currentHeight = window.innerHeight - this.navsHeight; 
      
  }

  ngOnInit() {
    console.log('latitude',this.lat) 
  }

}
