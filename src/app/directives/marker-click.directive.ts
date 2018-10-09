import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMarkerClick]'
})
export class MarkerClickDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    console.log(this.el)
    this.el.nativeElement.className += ' bg-dark text-light';    
  }

}
