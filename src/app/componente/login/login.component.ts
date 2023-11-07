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
  public grupo : FormGroup;
  public email :string="";
  public contra : string="";

  constructor(private router: Router,private fb : FormBuilder, private firebase : FirebaseService, private errores : ErroresService, private global : GlobalService)
  {
    this.grupo = this.fb.group({
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

  CompletarAdm()
  {
    this.email="tilopo8127@rdluxe.com";
    this.contra="micontraseñaadmin";
  }
  CompletarEsp()
  {
    this.email="kejobeb122@newnime.com";
    this.contra="micontrasela";
  }
  CompletarPas()
  {
    this.email="nafanay988@newnime.com";
    this.contra="estaasdsadas";
  }
}
