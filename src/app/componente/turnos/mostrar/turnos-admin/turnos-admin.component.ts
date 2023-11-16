import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Encuesta } from 'src/app/Clases/Encuesta';
import { Turno } from 'src/app/Clases/Turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-turnos-admin',
  templateUrl: './turnos-admin.component.html',
  styleUrls: ['./turnos-admin.component.css']
})
export class TurnosAdminComponent
{
  public encuesta : Encuesta = new Encuesta;
  public mostrarDiag : boolean = false;
  public diagnostico : Diagnostico= new Diagnostico;
  public escritura : string = "";
  public califText : string = "";
  public calificacion : boolean = false;
  public estado : string = "";
  public arrayTurnos : Array<Turno> =[];
  public arrayEncuestas : Array<Encuesta> =[];
  @ViewChild('busqueda') busqueda: any;
  public comentario: boolean =false;
  constructor( public global : GlobalService, private firebase : FirebaseService)
  {
    this.arrayTurnos = [...this.global.arrayTurnos];
  }
  @Output() newItemEvent = new EventEmitter<object>();

  ngOnInit(): void
  {
    this.firebase.TraerEncuesta()
    .subscribe((res)=>
    {
      this.arrayEncuestas =[];
      for(let element of res)
      {
        this.arrayEncuestas.push(new Encuesta( element["Recomendacion"], element["Atencion"] , element["Higiene"] , element["HorarioRespetado"], element["Paciente"]));
      }
    })
  }

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

  Comentario(turno : Turno)
  {
    this.comentario=true;
    this.estado=turno.estado;
    this.escritura=turno.comentario;
  }

  Diagnostico(turno : Turno)
  {
    this.diagnostico = turno.diagnostico;
    this.mostrarDiag = true;
  }

  VolverCom()
  {
    this.comentario = false;
  }

  VolverDiagMos()
  {
    this.mostrarDiag = false;
  }

  VolverCalif()
  {
    this.calificacion = false;
  }

  Calificar(calif : string)
  {
    this.calificacion = true;
    this.califText = calif;
  }

  Encuesta(email : string)
  {
    for(let encuesta of this.arrayEncuestas)
    {
      if(encuesta.emailPaciente == email)
      {
        this.encuesta = encuesta;
        break
      }
    }
  }
}
