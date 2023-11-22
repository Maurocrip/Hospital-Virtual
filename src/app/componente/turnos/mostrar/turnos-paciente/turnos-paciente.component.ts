import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Encuesta } from 'src/app/Clases/Encuesta';
import { Fecha } from 'src/app/Clases/Fecha';
import { Turno } from 'src/app/Clases/Turno';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit
{
  public mostrar: number =0;
  public encuesta : Encuesta = new Encuesta;
  private id : string ="";
  public diagnostico : Diagnostico= new Diagnostico;
  public escritura : string = "";
  public califiText : string = "";
  @ViewChild('higiene') higiene: any;
  @ViewChild('busqueda') busqueda: any;
  @Output() newItemEvent = new EventEmitter<object>();
  public arrrayTurosPaciente : Array<Turno> =[];
  public arrayTurnos : Array<Turno> =[];

  constructor( public global : GlobalService, private firebase : FirebaseService, private error : ErroresService){}

  ngOnInit(): void
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrrayTurosPaciente =[];
      for(let element of res)
      {
        if(element["EmailPaciente"] == this.global.usuario.email)
        {
          this.arrrayTurosPaciente.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"],element["Hora"]),element["Especialista"],
          element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"], element["Id"],
          element["Comentario"], new Diagnostico(element["Diagnostico"].peso,element["Diagnostico"].altura,element["Diagnostico"].diagnostico,
          element["Diagnostico"].temperatura,element["Diagnostico"].presion,element["Diagnostico"].extras), element["Calificacion"]));
        }
      }
      this.arrayTurnos = [...this.arrrayTurosPaciente];
    })
  }

  Cancelar(turno : Turno)
  {
    this.newItemEvent.emit({Valor : true, Texto : "Escribe el porque quieres cancelar", Id :turno.id, Estado : "cancelado"});
  }

  GuardarCalif()
  {
    this.firebase.ModificarTurnoCalificacion(this.id,this.califiText);
    this.califiText = "";
    this.mostrar = 0;
  }

  GuardarEncu()
  {
    if((this.encuesta.atencion >0 || this.encuesta.atencion <=10) && this.encuesta.higiene !="")
    {
      this.firebase.ModificarTurnoEncuesta(this.id, this.encuesta);
      this.encuesta = new Encuesta;
      this.mostrar = 0;
    }
    else
    {
      this.error.MostrarError("CIE")
    }
  }

  Higiene()
  {
    this.encuesta.higiene =this.higiene.nativeElement.value;
  }
  Buscar()
  {
    this.arrayTurnos = [];
    let busqueda = this.busqueda.nativeElement.value.toLocaleLowerCase();
    if(busqueda=="")
    {
      this.arrayTurnos = [...this.arrrayTurosPaciente];
    }
    else
    {
      for (let turno of this.arrrayTurosPaciente)
      {
        let fecha = turno.fecha.dia+"/"+turno.fecha.mes+"/"+turno.fecha.year;
        if(turno.especialidad.toLocaleLowerCase().includes(busqueda)|| turno.nombreEsp.toLocaleLowerCase().includes(busqueda) ||
        turno.nombrePas.toLocaleLowerCase().includes(busqueda)||
        turno.estado.toLocaleLowerCase().includes(busqueda)||
        fecha.toLocaleLowerCase().includes(busqueda)||
        turno.fecha.hora.toLocaleLowerCase().includes(busqueda)||
        turno.diagnostico.altura.toString().includes(busqueda)||
        turno.diagnostico.temperatura.toString().includes(busqueda)||
        turno.diagnostico.diagnostico.toLocaleLowerCase().includes(busqueda)||
        turno.diagnostico.peso.toString().includes(busqueda)||
        turno.diagnostico.presion.toString().includes(busqueda))
        {
          this.arrayTurnos.push(turno);
        }
        else
        {
          for(let datos of turno.diagnostico.extras)
          {
            if(datos.valor.includes(busqueda) || datos.clave.includes(busqueda))
            {
              this.arrayTurnos.push(turno);
            }
          }
        }
      }
    }
  }

  Mostrar(objeto : any, opcion : number)
  {
    switch(opcion)
    {
      case 1:
        this.diagnostico = objeto.diagnostico;
      break
      case 2:
        this.escritura=objeto;
      break
      case 3:
      case 4:
        this.id = objeto;
      break
    }
    this.mostrar = opcion;
  }

  Volver()
  {
    this.mostrar = 0;
  }
}
