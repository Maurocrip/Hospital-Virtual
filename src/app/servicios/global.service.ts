import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { ErroresService } from './errores.service';
import Swal from 'sweetalert2';
import { User } from '@angular/fire/auth';
import { Admin } from '../Clases/Admin';
import { Especialista } from '../Clases/Especialista';
import { Paciente } from '../Clases/Paciente';
import { Turno } from '../Clases/Turno';
import { Fecha } from '../Clases/Fecha';
import { Diagnostico } from '../Clases/Diagnostico';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {


  private _miArraySub = new BehaviorSubject<any[]>([]);
  public miArrayObs = this._miArraySub.asObservable();

  public arrayPasietes : Array<Paciente> =[];
  public arrayTurnos : Array<Turno> =[];
  public arrayEspecialidades : Array<string> =[];
  public arrayEspecialista : Array<Especialista> =[];
  public arrayUsuario : any =[];
  public arrayAdmin : Array<Admin> =[];
  public usuario : any = "";
  public tipo : string = "";
  constructor(private firebase : FirebaseService, private router: Router, private errores : ErroresService) 
  { 
    this.firebase.TraerPacientes()
    .subscribe((respuesta)=>
    {
      this.arrayPasietes =[];
      for(let element of respuesta)
      {
        this.arrayPasietes.push(new Paciente(element["Nombre"],element["Apellido"],element["Email"],element["Edad"],
        element["Dni"],element["ObraSocial"],element["Contra"],element["Foto2"],element["Foto1"]));         
      }
    });

    this.firebase.TraerEspecialista()
    .subscribe((respuesta)=>
    {
      this.arrayEspecialista =[];
      for(let element of respuesta)
      {
        this.arrayEspecialista.push(new Especialista(element["Nombre"],element["Apellido"],element["Email"],element["Edad"],
        element["Dni"],element["Especialidad"],element["Contra"],element["Foto"], element["Estado"], element["Id"], element["Trabaja"]));         
      }
    });

    this.firebase.TraerUsuarios()
    .subscribe((res)=>
    {
      this.arrayUsuario =[];
      for(let element of res)
      {     
        this.arrayUsuario.push({Email :element["Email"], Tipo :  element["Tipo"]});   
      }
    })

    this.firebase.TraerAdmin()
    .subscribe((res)=>
    {
      this.arrayAdmin =[];
      for(let element of res)
      {     
        this.arrayAdmin.push(new Admin(element["Nombre"],element["Apellido"],element["Email"],element["Edad"],
        element["Dni"],element["Contra"],element["Foto"]));   
      }
    })

    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrayTurnos =[];
      for(let element of res)
      {     
        this.arrayTurnos.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"],element["Hora"]),element["Especialista"],
        element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"], element["Id"], 
        element["Comentario"], new Diagnostico(element["Diagnostico"].peso,element["Diagnostico"].altura,element["Diagnostico"].diagnostico,
        element["Diagnostico"].temperatura,element["Diagnostico"].presion), element["Calificacion"]));   
      }
      this._miArraySub.next(this.arrayTurnos);
    })
    
    this.firebase.TraerEspecialidades()
    .subscribe((respuesta)=>
    {
      this.arrayEspecialidades =[];
      for(let element of respuesta)
      {
        this.arrayEspecialidades.push(element["Especialidad"]);         
      }
    });
  }

  UsuarioLogueado(tipo : string, element : any)
  {
    this.usuario = element;
    this.tipo = tipo;
    this.router.navigate(['home']);
  }

  VerificarMailPas( user : boolean | undefined, login : boolean)
  {
    if(user)
    {
      for(let element of this.arrayPasietes)
      {
        if(element.email == this.firebase.auth.currentUser?.email)
        {
          this.UsuarioLogueado("paciente",element);
          break;
        }
      }
    }
    else
    {
      if(login)
      {
        this.router.navigate(['validacionPas']);
      }
      else
      {
        this.errores.MostrarError("NV");
      }
    }
  }
 
  RestaurarAdmin(texto :string, user :User)
  {
    this.firebase.auth.updateCurrentUser(user)
    .then
    {
      Swal.fire({text :texto, icon:"success", title: "EXITO"});
    };
  }
}