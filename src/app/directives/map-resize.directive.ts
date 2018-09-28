import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMapResize]'
})
export class MapResizeDirective {

  constructor(
    private el: ElementRef,
  ) { }

  @HostListener('window:resize', ['$event']) onResize(event) {    
    const navsHeight = 106;
    this.el.nativeElement.style.height = (event.target.innerHeight - navsHeight) + 'px';
  }

}
