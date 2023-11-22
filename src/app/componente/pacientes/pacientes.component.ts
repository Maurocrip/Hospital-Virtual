import { Component } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Fecha } from 'src/app/Clases/Fecha';
import { Paciente } from 'src/app/Clases/Paciente';
import { Turno } from 'src/app/Clases/Turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent 
{
  public arrayPacientesDelDoctor : Array<Paciente> = [];
  constructor(private firebase : FirebaseService, public global : GlobalService)
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrayPacientesDelDoctor = [];
      for(let paciente of global.arrayPasietes)
      {
        for(let element of res)
        {
          if(element["EmailPaciente"] == paciente.email && element["EmailEspecialista"]== this.global.usuario.email)
          {
            this.arrayPacientesDelDoctor.push(paciente);
            break;
          }
        }
      }
    })
  }
}
