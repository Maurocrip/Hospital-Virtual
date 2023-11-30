import { Component } from '@angular/core';
import { Paciente } from 'src/app/Clases/Paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent 
{
  public habilitar :boolean = false;
  public paciente : Paciente = new Paciente;
  public prueba :number = 0;
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

  PruebaEspecialista(paciente: Paciente)
  {
    this.prueba = 1;
    this.paciente = paciente;
  }
  
  Volver()
  {
    this.prueba = 0;
  }

  Cambiar()
  {
    if(this.habilitar)
    {
      this.habilitar = false;
    }
    else
    {
      this.habilitar = true;
    }
  }

}
