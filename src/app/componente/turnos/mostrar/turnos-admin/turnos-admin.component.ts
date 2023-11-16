import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Turno } from 'src/app/Clases/Turno';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-turnos-admin',
  templateUrl: './turnos-admin.component.html',
  styleUrls: ['./turnos-admin.component.css']
})
export class TurnosAdminComponent 
{ 
  public arrayTurnos : Array<Turno> =[];
  @ViewChild('busqueda') busqueda: any;
  constructor( public global : GlobalService)
  {
    this.arrayTurnos = [...this.global.arrayTurnos];
  }
  @Output() newItemEvent = new EventEmitter<object>();

  Cancelar(turno : Turno)
  {
    this.newItemEvent.emit({Valor : true, Texto : "Escribe el porque quieres cancelar", Id :turno.id});     
  }

  Buscar()
  {
    this.arrayTurnos = [];
    let busqueda = this.busqueda.nativeElement.value.toLocaleLowerCase();
    if(busqueda=="")
    {
      this.arrayTurnos = [...this.global.arrayTurnos];
    }
    else
    {
      for (let turno of this.global.arrayTurnos) 
      {
        if(turno.especialidad.toLocaleLowerCase().includes(busqueda)|| turno.nombreEsp.toLocaleLowerCase().includes(busqueda))
        {
          this.arrayTurnos.push(turno);
        }
      }
    }
  }
}
