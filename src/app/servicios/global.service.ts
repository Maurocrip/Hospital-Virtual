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

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public arrayPasietes : any =[];
  public arrayTurnos : any =[];
  public arrayEspecialidades : any =[];
  public arrayEspecialista : any =[];
  public arrayUsuario : any =[];
  public arrayAdmin : any =[];
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
        element["Dni"],element["Especialidad"],element["Contra"],element["Foto"], element["Estado"], element["Id"]));         
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
        this.arrayTurnos.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"]),element["Especialista"],element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"] ));   
      }
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