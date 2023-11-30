import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appColorEstados]'
})
export class ColorEstadosDirective implements OnInit
{
  constructor(private el : ElementRef) { }
  @Input() estado = '';
  ngOnInit(): void 
  {
    switch(this.estado)
    {
      case "cancelado":
      case 'rechazado':
        this.el.nativeElement.style.color = "#da0f0f";
      break;
      case 'fializado':
        this.el.nativeElement.style.color = "#2c68ff";
      break;
      case 'aceptado':
        this.el.nativeElement.style.color = "#337107";
      break;
      case 'Esperando':
        this.el.nativeElement.style.color = "#840177";
      break;
      
      default:
        this.el.nativeElement.style.color = "black";
      break;
    }
  }

}
