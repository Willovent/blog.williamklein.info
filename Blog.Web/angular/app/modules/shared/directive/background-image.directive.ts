import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBackgroundImage]'
})
export class BackGroundImageDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('appBackgroundImage') backgroundUrl: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.style.backgroundImage = `url(${this.backgroundUrl})`;
  }
}
