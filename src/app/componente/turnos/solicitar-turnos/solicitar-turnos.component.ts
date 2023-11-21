import { Component, ViewChild } from '@angular/core';
import { Especialista } from 'src/app/Clases/Especialista';
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
  public pureba : number = 0
  @ViewChild('paciente') paciente: any;
  public arrayEspeccialidades : Array<any> =[];
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
    let mes : number = currentDate.getMonth() +1;
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
        if(new Date(year,mes-1,dia).getDay() == this.arrayTurnos[i].Value)
        {
          this.arrayFechasHabiles.push(new Fecha(dia,mes,year));
          break;
        }
      }

      dia++;
      diasSubidos++;
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
    if(this.turno.emailEsp!=""&&this.turno.emailPas!=""&&this.turno.fecha.dia != -1&& this.turno.especialidad!="" &&this.turno.fecha.hora!="0")
    {
      this.firebase.GuardarTurnos(this.turno);
      Swal.fire({text :"Nos vemos pronto", icon:"success", title: "Turno Creado"});
      this.turno = new Turno();
      this.arrayFechasHabiles = [];
      this.arrayHorarios=[];
      this.paciente.nativeElement.value = "";
      this.pureba =0;
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

  PruebaEspecialista(especialista : Especialista)
  {
    this.pureba =1;
    this.turno.emailEsp = especialista.email;
    this.turno.nombreEsp = especialista.nombre;
    this.arrayTurnos = especialista.diasHabiles;
    if(typeof especialista.especialiadad !== "string")
    {
      for(let epecialidad of especialista.especialiadad)
      {
        this.arrayEspeccialidades.push(epecialidad);
      }
    }
    else
    {
      this.arrayEspeccialidades.push(especialista.especialiadad);
    }
  }

  PruebaEspecialidad(especialidad : string)
  {
    this.pureba =2;
    this.turno.especialidad = especialidad;
    this.CargarArrayFechas();
  }

  PruebaFecha(dia:Fecha)
  {
    this.pureba =3;
    this.turno.fecha = dia;
    this.CargarHorarios();
  }

  PruebaHorario(horario:string)
  {
    this.turno.fecha.hora=horario;
    Swal.fire({
      title: "Registrar turno",
      text: "Estas seguro que quieres resgristrar el tueno?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        this.Registrar();
      }
    });
  }

  VolverPrueba(numero : number)
  {
    switch(numero)
    {
      case 0:
        this.turno.emailEsp = "";
        this.turno.nombreEsp = "";
        this.arrayEspeccialidades=[];
        this.arrayTurnos=[];
      break;
      case 1:
        this.turno.especialidad = "";
        this.arrayFechasDesHabiles = [];
        this.arrayFechasHabiles = [];
      break;
      case 2:
        this.turno.fecha = new Fecha;
        this.arrayHorarios = [];
      break;
    }
    this.pureba =numero;
  }
}