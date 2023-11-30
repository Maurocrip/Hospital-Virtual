import { Component, ViewChild } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { Storage } from '@angular/fire/storage';
import { Especialista } from 'src/app/Clases/Especialista';
import { Especialidades } from 'src/app/Clases/Especialidades';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})

export class EspecialistasComponent
{ 
  public especialidadClas : Especialidades = new Especialidades
  public especialista : Especialista = new Especialista;
  public file : File | undefined;
  @ViewChild('select') select: any;
  @ViewChild('especialidad') especialidad: any;
  public formGroup : FormGroup;
  private recaptcha: string = '';
  constructor(public global: GlobalService, private router: Router, private fb : FormBuilder, private firebase : FirebaseService, private errores : ErroresService, private storage : Storage)
  {
    this.formGroup = this.fb.group({
      nombre : ["",[Validators.required]],
      apellido : ["",[Validators.required]],
      email : ["",[Validators.required,Validators.email]],
      edad :["",[Validators.required, Validators.max(99), Validators.min(0)]],
      dni :["",[Validators.required, Validators.max(99999999), Validators.min(10000000)]],
      contraseña :["",[Validators.required]],
      foto :["",[Validators.required]]
    });
  }

  Selecion()
  {
    this.especialista.especialiadad = [];
    let especialidades :  any = document.getElementById("especialidades");
    for(let i = 0 ; i<especialidades.length; i++)
    {
      if(especialidades.options[i].selected)
      {
        this.especialista.especialiadad.push(especialidades.options[i].value)
      }
    }
  }

  async AgregarEspecialidad()
  {
    if(this.especialidad.nativeElement.value.replaceAll(" ", "")!="")
    {
      this.especialidadClas.nombre = this.especialidad.nativeElement.value;
      this.firebase.GuardarEspecialidades(this.especialidadClas);
      this.especialidad.nativeElement.value = "";
    }
  }

  Registrarse()
  {
    if(this.formGroup.status == "VALID" && this.recaptcha !="")
    {
      if(!this.especialista.especialiadad.includes(""))
      {
        let user : any = this.firebase.auth.currentUser;
        this.firebase.RegistrarUsuario(this.especialista.email, this.especialista.contra)
        .then(async(res)=> 
        {
          this.especialista.foto = await this.global.GuardarImagen(this.file,"especialista/"+ this.especialista.dni+Date.now()+"."+ this.file.name.split(".").pop(), this.storage);
          this.firebase.GuardarEspecialista(this.especialista);
          sendEmailVerification(res.user)
          .then(()=> 
          { 
            if(this.global.tipo!= 'admin')
            {
              this.router.navigate(['validacionEsp']);
            }
            else
            {
              this.global.RestaurarAdmin("Especialista creado, tiene que verificar el mail", user);
            }
          })
          .catch((err)=> 
          { 
            this.errores.MostrarError(err.code); 
          });
        })
        .catch((error)=> 
        { 
          this.errores.MostrarError(error.code); 
        });
      }
      else
      {
        this.errores.MostrarError("FE");
      }
    }
    else
    {
      this.errores.MostrarError("CI");
    }
  }

  imgUpload(event: any) 
  {
    const auxFile: File = event.target.files[0];
    this.file = auxFile;
  }

  funcion(response: string) 
  {
    this.recaptcha = response;
  }
}
