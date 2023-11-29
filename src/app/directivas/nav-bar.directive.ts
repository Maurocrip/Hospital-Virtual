import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNavBar]'
})
export class NavBarDirective implements OnInit
{
  constructor(private el : ElementRef) { }
  @Input() float = '';
  ngOnInit(): void 
  {
    this.el.nativeElement.style.float = this.float;
  }

}
