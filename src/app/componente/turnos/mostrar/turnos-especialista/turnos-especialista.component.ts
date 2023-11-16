import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Turno } from 'src/app/Clases/Turno';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css']
})
export class TurnosEspecialistaComponent implements OnInit
{

  private obj :Turno=new Turno;
  public diagnostico : Diagnostico= new Diagnostico;
  public escritura : string = "";
  public estado : string = "";
  public comentario : boolean = false;
  public mostrarDiag : boolean = false;
  public crearDiag : boolean = false;
  @ViewChild('texto') texto: any;
  @ViewChild('busqueda') busqueda: any;
  @Output() newItemEvent = new EventEmitter<object>();
  public arrayTurnos : Array<Turno> =[];
  public arrrayTurosEspecialista : Array<Turno> =[];

  constructor( public global : GlobalService, private firebase : FirebaseService, private error : ErroresService){}

  ngOnInit(): void 
  {
    this.global.miArrayObs.subscribe(array => 
    {
      this.arrrayTurosEspecialista =[];
      for(let element of array)
      {     
        if(element.emailEsp == this.global.usuario.email)
        {
          this.arrrayTurosEspecialista.push(element);   
        }
      }
    });
    this.arrayTurnos = [...this.arrrayTurosEspecialista];
  }
  
  Cancelar(turno : Turno)
  {
    this.newItemEvent.emit({Valor : true, Texto : "Escribe el porque quieres cacelarlo", Id :turno.id, Estado: "cancelado"});     
  }

  Aceptar(id : string)
  {
    this.firebase.ModificarTurnoEstado(id, "aceptado");
  }

  Rechazar(turno : Turno)
  {
    this.newItemEvent.emit({Valor : true, Texto : "Escribe el porque quieres rechazarlo", Id :turno.id, Estado: "rechazado"});  
  }
  
  Finalizar(turno : Turno)
  {
    this.obj = turno;
    this.crearDiag = true;
  }

  Comentario(turno : Turno)
  {
    this.comentario=true;
    this.estado=turno.estado;
    this.escritura=turno.comentario;
  }

  VolverCom()
  {
    this.comentario = false;
  }

  VolverDiag()
  {
    this.crearDiag = false;
  }

  VolverDiagMos()
  {
    this.mostrarDiag = false;
  }
  
  Guardar()
  {
    if(this.diagnostico.peso !=0 && this.diagnostico.altura !=0 && this.diagnostico.diagnostico !="" && this.diagnostico.presion !=0 && this.diagnostico.temperatura !=0 && this.texto.nativeElement.value !="")
    {
      this.firebase.ModificarTurnoDiagnostico(this.obj.id, {estado: "fializado", reseña : this.texto.nativeElement.value, 
      diagnostico: {peso : this.diagnostico.peso, altura : this.diagnostico.altura, diagnostico :this.diagnostico.diagnostico}});
      this.crearDiag = false;
    }
    else
    {
      this.error.MostrarError("CID");
    }
  }

  Diagnostico(turno : Turno)
  {
    console.log(turno);
    this.diagnostico = turno.diagnostico;
    this.mostrarDiag = true;
  }

  Buscar()
  {
    this.arrayTurnos = [];
    let busqueda = this.busqueda.nativeElement.value.toLocaleLowerCase();
    if(busqueda=="")
    {
      this.arrayTurnos = [...this.arrrayTurosEspecialista];
    }
    else
    {
      for (let turno of this.arrrayTurosEspecialista) 
      {
        if(turno.especialidad.toLocaleLowerCase().includes(busqueda)|| turno.nombrePas.toLocaleLowerCase().includes(busqueda))
        {
          this.arrayTurnos.push(turno);
        }
      }
    }
  }
}
