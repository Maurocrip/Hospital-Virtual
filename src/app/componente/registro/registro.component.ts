import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent 
{
  public tipo : number = 0;

  constructor(public global: GlobalService, private router: Router){}

  Cambiar(numero :  number)
  {
    this.tipo = numero;
  }

  Volver()
  {
    if(this.tipo!=0)
    {
      this.Cambiar(0);
    }
    else
    {
      this.router.navigate(['usuario']);
    }
  }
}
