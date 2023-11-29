import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBotonGraficos]'
})
export class BotonHoverDirective implements OnInit
{
  @Input() color = '';
  @Input() colorHover = '';
  constructor(private el : ElementRef) { }

  ngOnInit(): void 
  {
    this.el.nativeElement.style.backgroundColor = this.color;
    this.el.nativeElement.style.borderRadius = "15px";
  }

  @HostListener('mouseover') onMouseOver()
  {
    this.el.nativeElement.style.backgroundColor = this.colorHover;
  }

  @HostListener('mouseout') onMouseOut() {
    this.el.nativeElement.style.backgroundColor = this.color;
  }

}
