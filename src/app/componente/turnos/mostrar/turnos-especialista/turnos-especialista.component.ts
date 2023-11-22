import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Fecha } from 'src/app/Clases/Fecha';
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
  public problema : any = {clave : "", valor : ""}; 
  private obj :Turno=new Turno;
  public diagnostico : Diagnostico= new Diagnostico;
  public escritura : string = "";
  public estado : string = "";
  public califText : string = "";
  @ViewChild('texto') texto: any;
  @ViewChild('busqueda') busqueda: any;
  @Output() newItemEvent = new EventEmitter<object>();
  public arrayTurnos : Array<Turno> =[];
  public arrrayTurosEspecialista : Array<Turno> =[];
  public mostrar: number =0;

  constructor( public global : GlobalService, private firebase : FirebaseService, private error : ErroresService){}

  ngOnInit(): void
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrrayTurosEspecialista =[];
      for(let element of res)
      {
        if(element["EmailEspecialista"] == this.global.usuario.email)
        {
          this.arrrayTurosEspecialista.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"],element["Hora"]),element["Especialista"],
          element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"], element["Id"],
          element["Comentario"], new Diagnostico(element["Diagnostico"].peso,element["Diagnostico"].altura,element["Diagnostico"].diagnostico,
          element["Diagnostico"].temperatura,element["Diagnostico"].presion, element["Diagnostico"].extras), element["Calificacion"]));
        }
      }
      this.arrayTurnos = [...this.arrrayTurosEspecialista];
    })
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

  Guardar()
  {
    if(this.diagnostico.peso !=0 && this.diagnostico.altura !=0 && this.diagnostico.diagnostico !="" && this.diagnostico.presion !=0 && this.diagnostico.temperatura !=0 && this.texto.nativeElement.value !="")
    {
      this.firebase.ModificarTurnoDiagnostico(this.obj.id, {estado: "fializado", reseña : this.texto.nativeElement.value,
      diagnostico: {peso : this.diagnostico.peso, altura : this.diagnostico.altura, diagnostico :this.diagnostico.diagnostico, temperatura : this.diagnostico.temperatura, presion : this.diagnostico.presion, extras : this.diagnostico.extras}});
      this.mostrar = 0;
    }
    else
    {
      this.error.MostrarError("CID");
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
        console.log(this.diagnostico);
      break
      case 3:
        this.diagnostico = new Diagnostico;
        this.obj = objeto;
      break
      case 4:
        this.califText = objeto;
      break
    }
    this.mostrar = opcion;
  }

  Volver()
  {
    this.mostrar = 0;
  }

  VolverProblema()
  {
    this.mostrar = 3;
    this.problema = {clave : "", valor : ""};
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

  Agregar()
  {
    if(this.problema.valor !="" &&this.problema.clave !="")
    {
      this.diagnostico.extras.push(this.problema);
      this.VolverProblema();
    }
    else
    {
      this.error.MostrarError("CI");
    }
  }
}
