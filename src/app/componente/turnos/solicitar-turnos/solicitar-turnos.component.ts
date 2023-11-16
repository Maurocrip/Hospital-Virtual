import { Component, ViewChild } from '@angular/core';
import { Fecha } from 'src/app/Clases/Fecha';
import { Turno } from 'src/app/Clases/Turno';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turnos',
  templateUrl: './solicitar-turnos.component.html',
  styleUrls: ['./solicitar-turnos.component.css']
})
export class SolicitarTurnosComponent 
{
  @ViewChild('fecha') fecha: any;
  @ViewChild('hora') hora: any;
  @ViewChild('especialidad') especialidad: any;
  @ViewChild('paciente') paciente: any;
  @ViewChild('especialista') especialista: any;
  public arrayEspecialista : Array<any> =[];
  public arrayFechasHabiles : Array<any> =[];
  public arrayHorarios : Array<any> =[];
  public arrayTurnos : Array<any> =[];
  public arrayFechasDesHabiles : Array<any> =[];
  public turno : Turno = new Turno();

  constructor(public global: GlobalService, public firebase : FirebaseService, private errores : ErroresService)
  {
    if(this.global.tipo=="paciente")
    {
      this.turno.nombrePas = this.global.usuario.nombre;
      this.turno.emailPas = this.global.usuario.email;
    }
  }
  
  CargarArrayFechas()
  {
    let currentDate : Date = new Date();
    let dia : number = currentDate.getDate();
    let mes : number = currentDate.getMonth();
    let year : number = currentDate.getFullYear();

    this.arrayFechasDesHabiles = [];
    for(let turno of this.global.arrayTurnos)
    {
      if(turno.emailEsp == this.turno.emailEsp)
      {
        this.arrayFechasDesHabiles.push(turno.fecha);
      }
    }

    switch(mes)
    {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:      
        this.CargarFechas(dia,mes,year,31);
      break
      case 2:
        this.CargarFechas(dia,mes,year,28);
      break
      case 4:
      case 6:
      case 9:
      case 11:
        this.CargarFechas(dia,mes,year,30);
      break;
    }
  }

  CargarFechas(dia : number, mes :number, year : number, max : number)
  {
    let diasSubidos : number=0;
    let fecha = new Fecha(0,0,0);

    while(diasSubidos<=14)
    {
      if(dia>max)
      {
        dia=1
        if(mes==12)
        {
          mes=1;
          year++
        }
        else
        {
          mes++
        }
      }

      fecha = new Fecha(dia,mes,year);

      for (let i = 0; i < this.arrayTurnos.length; i++) 
      {
        if(new Date(year,mes,dia).getDay() == this.arrayTurnos[i].Value)
        {
          this.arrayFechasHabiles.push(new Fecha(dia,mes,year));
          break;
        }
      }

      dia++;
      diasSubidos++;
    }
  }

  SelecEspecialista()
  {
    this.arrayHorarios = [];
    this.arrayFechasHabiles =[];
    this.arrayTurnos = [];
    this.turno.fecha= new Fecha;
    this.turno.emailEsp="";
    this.turno.nombreEsp="";
    let email = this.especialista.nativeElement.value;
    for(let especialista of this.arrayEspecialista)
    {
      if(especialista.email == email)
      {
        this.turno.nombreEsp = especialista.nombre;
        this.turno.emailEsp = especialista.email;
        this.turno.especialidad = this.especialidad.nativeElement.value;
        this.arrayTurnos = especialista.diasHabiles;
        this.CargarArrayFechas()
        break;
      }
    }
  }

  SelecFecha()
  {
    this.turno.fecha=new Fecha;
    this.arrayHorarios = [];
    let dia = this.fecha.nativeElement.value;
    if(dia !="")
    {
      for(let fecha of this.arrayFechasHabiles)
      {
        if(fecha.dia == dia)
        {
          this.turno.fecha = fecha;
          this.CargarHorarios();
        }
      }
    }
  }
  
  SelecionEspecialidad()
  {
    this.arrayHorarios = [];
    this.arrayEspecialista = [];
    this.arrayFechasHabiles = [];
    this.turno.fecha=new Fecha;
    this.turno.emailEsp="";
    this.turno.nombreEsp="";
    let especialidad = this.especialidad.nativeElement.value;
    if(especialidad != "")
    {
      for(let especialista of this.global.arrayEspecialista)
      {
        if(especialista.especialiadad.includes(especialidad))
        {
          this.arrayEspecialista.push(especialista);
        }
      }
    }
  }

  SelecionPas()
  {
    this.turno.nombrePas="";
    this.turno.emailPas="";
    let paciente = this.paciente.nativeElement.value;
    for(let persona of this.global.arrayPasietes)
    {
      if(persona.email == paciente)
      {
        this.turno.nombrePas = persona.nombre;
        this.turno.emailPas = persona.email;
        break;
      }
    }
  }

  SelecHorario()
  {
    this.turno.fecha.hora = this.hora.nativeElement.value;
  }

  Registrar()
  {
    if(this.turno.emailEsp!=""&&this.turno.emailPas!=""&&this.turno.fecha.dia != -1&& this.turno.especialidad!="" &&this.turno.fecha.hora!="0")
    {
      this.firebase.GuardarTurnos(this.turno);
      Swal.fire({text :"Nos vemos pronto", icon:"success", title: "Turno Creado"});
      this.especialidad.nativeElement.value = "";
      this.arrayEspecialista = [];
      this.arrayFechasHabiles = [];
      this.arrayHorarios=[];
      this.paciente.nativeElement.value = "";
      this.turno = new Turno();
    }
    else
    {
      this.errores.MostrarError("CI");
    }
  }

  CargarHorarios()
  {
    let flag1 : boolean = true;
    let flag2 : boolean = true;
    let hora1 : string = "";
    let hora2 : string = "";
    for (let i = 7; i < 24; i++) 
    {
      hora1 += i +":00";
      hora2 += i +":30";

      for(let fecha of this.arrayFechasDesHabiles)
      {
        if(fecha.dia == this.turno.fecha?.dia && fecha.mes == this.turno.fecha?.mes)
        {
          if(fecha.hora == hora1)
          {
            flag1 = false;
          }

          if(fecha.hora == hora2)
          {
            flag2 = false;
          }
        }
      }

      if(flag1)
      {
        this.arrayHorarios.push(hora1);
      }
      else
      {
        flag1 = true;
      }
      
      if(flag2)
      {
        this.arrayHorarios.push(hora2);
      }
      else
      {
        flag2 = true;
      }

      hora1 = "";
      hora2 = "";
    }
  }
}