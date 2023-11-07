import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor() { }

  MostrarError(codigoError : string)
  {
    switch(codigoError)
    {
      case "auth/invalid-email": 
      this.GenerarAlerta("No tiene el formato email (ejemplo@gmail.com)","warning","EL IMAIL!!");
      break;

      case "auth/email-already-in-use": 
        this.GenerarAlerta("El mail ya existe","error","Lo sentimos");
      break;

      case "auth/weak-password": 
        this.GenerarAlerta("La contraseña debe de tener mas de 6 caracteres","warning","CONTRASEÑA INSEGURA!!");
      break;

      case "auth/missing-password": 
        this.GenerarAlerta("Falta la contraseña","warning","CUIDADO!!");
      break;

      case "auth/invalid-login-credentials": 
        this.GenerarAlerta("No existe ese ususario","error","Registrate!!");
      break;

      case "NV": 
        this.GenerarAlerta("Tienes que verificar el email","error","EMAIL NO VERIFICADO!!");
      break;

      case "AD": 
        this.GenerarAlerta("Te tiene que habilitar el administrador","warning","NO PUEDES ENTRAR!!");
      break;

      case "CI": 
        this.GenerarAlerta("Hay algun campo incompleto o con algún error","warning","CUIDADO!!");
      break;

      case "DE": 
      this.GenerarAlerta("Un administrador te denego al entrada","warning","DENEGADO!!");
      break;

      case "FE": 
      this.GenerarAlerta("Falta la especialidad","warning","CUIDADO!!");
      break;

      default:
        this.GenerarAlerta("Descuida no es tu culpa","error","ERROR NO REGISTRADO!!");
        console.log(codigoError);
      break;
    }
  }

  GenerarAlerta(texto : string, icono : SweetAlertIcon, titulo : string)
  {
    Swal.fire({text :texto, icon:icono, title: titulo});
  }
}
