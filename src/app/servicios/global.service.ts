import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { ErroresService } from './errores.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public arrayPasietes : any =[];
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

  RestaurarAdmin(texto :string)
  {
    this.firebase.DesLogueo(this.firebase.auth)
    .then(()=>
    {
      this.firebase.LogIn(this.usuario.email,this.usuario.contra);
      Swal.fire({text :texto, icon:"success", title: "EXITO"});
    })
    .catch((error)=> 
    { 
      this.errores.MostrarError(error.code); 
    });
  }
}

export class Paciente 
{
  public nombre : string = "";
  public apellido : string = "";
  public email : string = "";
  public edad : number = 0;
  public dni : number = 0;
  public obraSocial : string = "";
  public contra : string = "";
  public foto2 : string | void;
  public foto1 :  string | void;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, obraSocial : string = "", contra : string = "", foto2 : string = "", foto1 : string = "")
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.obraSocial = obraSocial;
    this.contra = contra;
    this.foto2 = foto2;
    this.foto1 = foto1;
  }
}

export class Admin 
{
  public nombre : string = "";
  public apellido : string = "";
  public email : string = "";
  public edad : number = 0;
  public dni : number = 0;
  public contra : string = "";
  public foto : string | void;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, contra : string = "", foto : string = "")
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.contra = contra;
    this.foto = foto;
  }
}

export class Especialista 
{
  public id : string;
  public nombre : string ;
  public apellido : string ;
  public email : string;
  public edad : number ;
  public dni : number;
  public contra : string;
  public especialiadad : string;
  public foto : string | void;
  public estado : string;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, especialiadad : string = "", contra : string = "", foto : string = "", estado : string = "desahabilitado", id = "")
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.especialiadad = especialiadad;
    this.contra = contra;
    this.foto = foto;
    this.estado = estado;
    this.id = id;
  }
}