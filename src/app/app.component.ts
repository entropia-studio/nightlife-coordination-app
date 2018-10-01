import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Nightlife Coordination Life';  
  lat: number = 51.678418;
  lng: number = 7.809007;
  currentHeight: number;
  navsHeight:number  = 106;

  constructor(){
    // Current available space in navigator    
    this.currentHeight = window.innerHeight - this.navsHeight;    
  }

  ngOnInit(){    
  }
}
