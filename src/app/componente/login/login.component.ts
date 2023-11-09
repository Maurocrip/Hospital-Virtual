import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService  } from 'src/app/servicios/firebase.service';
import { Router } from '@angular/router';
import { ErroresService } from 'src/app/servicios/errores.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  public arrayUsuarios : Array<any>;
  public grupo : FormGroup;
  public email :string="";
  public contra : string="";
  public habilitar :boolean = false;

  constructor(private router: Router,private fb : FormBuilder, private firebase : FirebaseService, private errores : ErroresService, private global : GlobalService)
  {
    this.arrayUsuarios=
    [
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/pasientes%2F123456781699553404422.png?alt=media&token=b5279f9f-ce56-479f-a846-60049184b153",email : "tigif76897@othao.com",contra : "miprimerpaciente"},
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/pasientes%2F784569521699554620339.jpg?alt=media&token=c0e890fa-a1a7-4aac-9fc9-40f034456f52",email : "vejax96154@mkurg.com",contra : "misegundopaciete"},
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/pasientes%2F965874231699554862221.jpeg?alt=media&token=8f43d64e-532b-4fc0-987b-86181e45b2e7",email : "yemarev772@rdluxe.com",contra : "cantrapasientetres"},
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/especialista%2F965874521699555024053.png?alt=media&token=6fc5919d-737e-4f0f-96a7-e3658d8bea20",email : "gocegib156@othao.com",contra : "doctoraespecialista"},
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/especialista%2F444444441699535860040.png?alt=media&token=4783f3b1-32c5-4b71-b660-38c87201ee2c",email : "agustinfrich@gmail.com",contra : "123456"},
      {imagen : "https://firebasestorage.googleapis.com/v0/b/hospitalonline-54e32.appspot.com/o/admistrador%2F857459621699555279783.png?alt=media&token=48860e8a-4e86-4f0b-96e4-c70d70de0c88",email : "wavosa9604@othao.com",contra : "adminnuevo"}
    ]

    this.grupo = this.fb.group
    ({
      email : ["",[Validators.required,Validators.email]],
      contraseña :["",[Validators.required]]
    });
  };

  Registrarse()
  {
    if(this.grupo.status == "VALID")
    {
      this.firebase.LogIn(this.email,this.contra)
      .then((res)=> 
      {
        let tipo : string = "";
        
        for(let element of this.global.arrayUsuario)
        {
          if(element["Email"] == this.firebase.auth.currentUser?.email)
          {
            tipo = element["Tipo"];
            break;
          }
        }
        
        switch(tipo)
        {
          case "paciente":
            this.global.VerificarMailPas(res.user.emailVerified, true);
          break;

          case "especialista":
            if(res.user.emailVerified)
            {
              for(let element of this.global.arrayEspecialista)
              {
                if(element.email == this.firebase.auth.currentUser?.email)
                {
                  switch(element.estado)
                  {
                    case "desahabilitado":
                      this.errores.MostrarError("AD");
                    break;

                    case "habilitado":
                      this.global.UsuarioLogueado("especialista", element);
                    break;

                    case "denegado":
                      this.errores.MostrarError("DE");
                    break;
                  }
                  break;
                }
              }
            }
            else
            {
              this.router.navigate(['validacionEsp']);
            }
          break;
          
          case "admin":
            for(let element of this.global.arrayAdmin)
            {
              if(element.email == this.firebase.auth.currentUser?.email)
              {
                this.global.UsuarioLogueado("admin", element);
              }
            }
          break;
        }   
      })
      .catch((error)=>
      {
        this.errores.MostrarError(error.code);
      });
    }
    else
    {
      this.errores.MostrarError("CI");
    }
  }


  Completar(email:string, contra:string)
  {
    this.email= email;
    this.contra= contra;
  }

  Cambiar()
  {
    if(this.habilitar)
    {
      this.habilitar = false;
    }
    else
    {
      this.habilitar = true;
    }
  }
}
