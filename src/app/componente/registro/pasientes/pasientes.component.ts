import { Component } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService  } from 'src/app/servicios/firebase.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';
import { ErroresService } from 'src/app/servicios/errores.service';
import { Paciente } from 'src/app/Clases/Paciente';

@Component({
  selector: 'app-pasientes',
  templateUrl: './pasientes.component.html',
  styleUrls: ['./pasientes.component.css']
})
export class PasientesComponent 
{
  public paciente : Paciente = new Paciente;
  public file1 : File | undefined;
  public file2 : File | undefined;
  public grupo : FormGroup;
  private recaptcha: string = '';
  constructor(private global: GlobalService, private router: Router,private fb : FormBuilder, private firebase : FirebaseService, private storage : Storage, private errores : ErroresService)
  {
    this.grupo = this.fb.group({
      nombre : ["",[Validators.required]],
      apellido : ["",[Validators.required]],
      email : ["",[Validators.required,Validators.email]],
      edad :["",[Validators.required, Validators.max(99), Validators.min(0)]],
      dni :["",[Validators.required, Validators.max(99999999), Validators.min(10000000)]],
      obraSocial :["",[Validators.required]],
      contraseña :["",[Validators.required]],
      foto2 :["",[Validators.required]],
      foto1 : ["",[Validators.required]]
    });
  };

  Registrarse()
  {
    if(this.grupo.status == "VALID" && this.recaptcha !="")
    {
      let user : any = this.firebase.auth.currentUser;
      this.firebase.RegistrarUsuario(this.paciente.email, this.paciente.contra)
      .then(async(res)=> 
      {
        this.paciente.foto1 = await this.global.GuardarImagen(this.file1,"pasientes/"+ this.paciente.dni+Date.now()+"."+this.file1.name.split(".").pop(),this.storage);
        this.paciente.foto2 = await this.global.GuardarImagen(this.file2,"pasientes/"+ this.paciente.dni+Date.now()+"."+this.file1.name.split(".").pop(),this.storage);
        this.firebase.GuardarPaciente(this.paciente);
        sendEmailVerification(res.user)
        .then(()=>
        {
          if(this.global.tipo!= 'admin')
          {
            this.router.navigate(['validacionPas']);
          }
          else
          {
            this.global.RestaurarAdmin("Paciente creado, tiene que verificar el mail", user);
          }

        })
        .catch((err)=>{console.log(err)});
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

  imgUpload(event: any, opcion : boolean) 
  {
    const auxFile: File = event.target.files[0];
    if(opcion)
    {
      this.file1 = auxFile;
    }
    else
    {
      this.file2 = auxFile;     
    }
  }

  funcion(response: string) 
  {
    this.recaptcha = response;
  }
}


