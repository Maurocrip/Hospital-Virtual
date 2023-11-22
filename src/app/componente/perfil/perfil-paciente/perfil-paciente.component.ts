import { Component, Input } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Fecha } from 'src/app/Clases/Fecha';
import { Turno } from 'src/app/Clases/Turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent 
{
  @Input() mailPaciente :string ="";
  public arrayTurnos : Array<Turno> = [];
  constructor(private firebase : FirebaseService, public global : GlobalService)
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrayTurnos =[];
      for(let element of res)
      {
        if(element["EmailPaciente"] == this.global.usuario.email || element["EmailPaciente"] == this.mailPaciente)
        {
          this.arrayTurnos.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"],element["Hora"]),element["Especialista"],
          element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"], element["Id"],
          element["Comentario"], new Diagnostico(element["Diagnostico"].peso,element["Diagnostico"].altura,element["Diagnostico"].diagnostico,
          element["Diagnostico"].temperatura,element["Diagnostico"].presion,element["Diagnostico"].extras), element["Calificacion"]));
        }
      }
    })
  }

}
