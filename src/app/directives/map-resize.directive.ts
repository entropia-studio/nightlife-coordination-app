import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMapResize]'
})
export class MapResizeDirective {
  
  navsHeight:number = 106;

  constructor(
    private el: ElementRef,    
  ) {
    el.nativeElement.style.height = (window.innerHeight - this.navsHeight) + 'px'; 
    console.log('window.innerHeight',window.innerHeight)       
  }    

  @HostListener('window:resize', ['$event']) onResize(event) {        
    this.el.nativeElement.style.height = (event.target.innerHeight - this.navsHeight) + 'px';
  }

}
