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
  @ViewChild('select') select: any;
  @ViewChild('especialidad') especialidad: any;
  @ViewChild('paciente') paciente: any;
  @ViewChild('especialista') especialista: any;
  public arrayEspecialista : Array<any> =[];
  public arrayFechasHabiles : Array<any> =[];
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
    for(let a of this.global.arrayTurnos)
    {
      if(a.emailEsp == this.turno.emailEsp)
      {
        this.arrayFechasDesHabiles.push(a.fecha);
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
    let flag = true;

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

      for(let a of this.arrayFechasDesHabiles)
      {
        if(fecha.dia == a.dia && fecha.mes == a.mes)
        {
          flag =false;
          break;
        }
      }

      if(flag)
      {
        this.arrayFechasHabiles.push(new Fecha(dia,mes,year));
      }
      else
      {
        flag=true;
      }

      dia++;
      diasSubidos++;
    }
  }

  Selecion()
  {
    this.arrayFechasHabiles =[];
    this.turno.fecha=null;
    this.turno.emailEsp="";
    this.turno.nombreEsp="";
    let email = this.especialista.nativeElement.value;
    for(let especialista of this.arrayEspecialista)
    {
      if(especialista.email == email)
      {
        this.turno.nombreEsp = especialista.nombre;
        this.turno.emailEsp = especialista.email;
        this.turno.especialidad = especialista.especialiadad;
        this.CargarArrayFechas()
        break;
      }
    }
  }

  SelecDia()
  {
    this.turno.fecha=null;
    let dia = this.select.nativeElement.value;
    for(let fecha of this.arrayFechasHabiles)
    {
      if(fecha.dia == dia)
      {
        this.turno.fecha = fecha;
        break;
      }
    }
  }
  
  SelecionEspecialidad()
  {
    this.arrayEspecialista = [];
    this.arrayFechasHabiles = [];
    this.turno.fecha=null;
    this.turno.emailEsp="";
    this.turno.nombreEsp="";
    let especialidad = this.especialidad.nativeElement.value;
    for(let especialista of this.global.arrayEspecialista)
    {
      if(especialista.especialiadad == especialidad)
      {
        this.arrayEspecialista.push(especialista);
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

  Registrar()
  {
    if(this.turno.emailEsp!=""&&this.turno.emailPas!=""&&this.turno.fecha!=null&&this.turno.especialidad!="")
    {
      this.firebase.GuardarTurnos(this.turno);
      Swal.fire({text :"Nos vemos pronto", icon:"success", title: "Turno Creado"});
      this.especialidad.nativeElement.value = "";
      this.arrayEspecialista = [];
      this.arrayFechasHabiles = [];
      this.paciente.nativeElement.value = "";
      this.turno = new Turno();
    }
    else
    {
      this.errores.MostrarError("CI");
    }
  }

  Volver()
  {
    
  }
}