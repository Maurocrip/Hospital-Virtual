import { Component, Input, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Fecha } from 'src/app/Clases/Fecha';
import { Turno } from 'src/app/Clases/Turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { PdfService } from 'src/app/servicios/pdf.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent 
{
  @ViewChild('especialista') especialista: any;
  @Input() mailPaciente :string ="";
  public arrayTurnos : Array<any> = [];
  public arrayMostrarTurnos : Array<any> = [];

  constructor(private firebase : FirebaseService, public global : GlobalService, private pdf : PdfService)
  {
    this.firebase.TraerTurnos().subscribe((res)=>
    {
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
      this.arrayMostrarTurnos = [...this.arrayTurnos];
    })
  }

  async Descargar()
  {
    let problemas : string = "";
    let tabla : Array<any[]> = [['Paciente', 'Especialista', 'Fecha','Peso', 'Altura', 'Temperatura','Precion', 'Diagnostico', 'Otros problemas']];
    for(let turno of this.arrayMostrarTurnos) 
    {
      for(let problema of turno.diagnostico.extras)
      {
        problemas +=problema.clave + ":" + problema.valor + "\n";
      }
      const nuevaFila = [turno.nombrePas, turno.nombreEsp, turno.fecha.year+'/'+ turno.fecha.mes+'/'+turno.fecha.dia,turno.diagnostico.peso, 
      turno.diagnostico.altura, turno.diagnostico.temperatura,turno.diagnostico.presion, turno.diagnostico.diagnostico, problemas];
      tabla.push(nuevaFila);
    }

    this.pdf.DescargarTabla(tabla,'Historial Clinico','Este es el historial clinico del paciente: '+this.global.usuario.nombre);

  }

  Selecion()
  {
    if(this.especialista.nativeElement.value!='')
    {
      this.arrayMostrarTurnos = [];
      this.arrayMostrarTurnos = this.arrayTurnos.filter(turno => turno.nombreEsp == this.especialista.nativeElement.value);
    }
    else
    {
      this.arrayMostrarTurnos = [...this.arrayTurnos];
    }
  }
}
