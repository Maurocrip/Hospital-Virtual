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
  public encuesta : Encuesta = new Encuesta;
  private id : string ="";
  public diagnostico : Diagnostico= new Diagnostico;
  public mostrarDiag : boolean = false;
  public escritura : string = "";
  public mostrar : boolean = false;
  public calificacion : boolean = false;
  public mosEncu : boolean = false;
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
          element["Diagnostico"].temperatura,element["Diagnostico"].presion), element["Calificacion"]));
        }
      }
      this.arrayTurnos = [...this.arrrayTurosPaciente];
    })
  }

  Cancelar(turno : Turno)
  {
    this.newItemEvent.emit({Valor : true, Texto : "Escribe el porque quieres cancelar", Id :turno.id, Estado : "cancelado"});
  }

  Comentario(reseña : string)
  {
    this.mostrar=true;
    this.escritura=reseña;
  }

  Volver()
  {
    this.mostrar = false;
  }

  Encuesta()
  {
    this.mosEncu = true;
  }

  Calificar(id : string)
  {
    this.id = id;
    this.calificacion=true
  }

  Diagnostico(turno : Turno)
  {
    this.diagnostico = turno.diagnostico;
    this.mostrarDiag = true;
  }

  VolverDiagMos()
  {
    this.mostrarDiag = false;
  }

  VolverEncu()
  {
    this.mosEncu = false;
  }

  VolverCalif()
  {
    this.calificacion = false;
  }

  GuardarCalif()
  {
    this.firebase.ModificarTurnoCalificacion(this.id,this.califiText)
    this.calificacion = false;
  }

  GuardarEncu()
  {
    if((this.encuesta.atencion >0 || this.encuesta.atencion <=10) && this.encuesta.higiene !="")
    {
      this.firebase.GuardarEncuesta(this.encuesta);
      this.mosEncu = false;
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
        if(turno.especialidad.toLocaleLowerCase().includes(busqueda)|| turno.nombreEsp.toLocaleLowerCase().includes(busqueda))
        {
          this.arrayTurnos.push(turno);
        }
      }
    }
  }
}
