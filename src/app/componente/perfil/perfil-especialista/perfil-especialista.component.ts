import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-perfil-especialista',
  templateUrl: './perfil-especialista.component.html',
  styleUrls: ['./perfil-especialista.component.css']
})
export class PerfilEspecialistaComponent 
{ 
  public arrayDiasMostrar : Array<any> = 
  [
    {Dia: "lunes", Value : 1}, {Dia: "martes", Value : 2},{Dia: "miercoles", Value : 3}, {Dia: "jueves", Value : 4}, {Dia: "viernes", Value : 5}, 
    {Dia: "sabado", Value : 6}, {Dia: "domingo", Value : 0}
  ]
  public arrayDiasGuardar : Array<any> = [];

  constructor(private firebase : FirebaseService, public global : GlobalService){}

  Select(dia : Array<any>)
  {
    if(!this.arrayDiasGuardar.includes(dia))
    {
      this.arrayDiasGuardar.push(dia);
    }
  }

  Borrar()
  {
    this.arrayDiasGuardar=[];
  }

  Guardar()
  {
    this.firebase.ModificarEspecialistaDias(this.global.usuario.id,this.arrayDiasGuardar);
    this.arrayDiasGuardar = [];
  }

}
