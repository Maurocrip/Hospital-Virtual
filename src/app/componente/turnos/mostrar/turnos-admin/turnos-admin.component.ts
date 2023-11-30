import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Encuesta } from 'src/app/Clases/Encuesta';
import { Fecha } from 'src/app/Clases/Fecha';
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
  public mostrar : number =0;
  public encuesta : Encuesta = new Encuesta;
  public diagnostico : Diagnostico= new Diagnostico;
  public escritura : string = "";
  public califText : string = "";
  public estado : string = "";
  public arrayTurnos : Array<Turno> =[];
  public arrayEncuestas : Array<Encuesta> =[];
  @ViewChild('busqueda') busqueda: any;
  @Output() newItemEvent = new EventEmitter<object>();

  constructor( public global : GlobalService, private firebase : FirebaseService){}

  ngOnInit(): void
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrayTurnos =[...this.global.arrayTurnos];
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

  Mostrar(objeto : any, opcion : number)
  {
    switch(opcion)
    {
      case 1:
        this.estado=objeto.estado;
        this.escritura=objeto.comentario;
      break
      case 2:
        this.diagnostico = objeto.diagnostico;
      break
      case 3:
        this.califText = objeto;
      break
      case 4:
        this.encuesta = objeto;
      break
    }
    this.mostrar = opcion;
  }

  Volver()
  {
    this.mostrar = 0;
  }
}
