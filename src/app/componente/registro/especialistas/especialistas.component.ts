import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Especialista, GlobalService } from 'src/app/servicios/global.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})

export class EspecialistasComponent 
{
  public especialista : Especialista = new Especialista;
  public file : File | undefined;
  @ViewChild('select') select: any;
  @ViewChild('especialidad') especialidad: any;
  public formGroup : FormGroup;
  constructor(private global: GlobalService, private router: Router, private fb : FormBuilder, private firebase : FirebaseService, private errores : ErroresService, private storage : Storage)
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
  };

  Selecion()
  {
    if(this.select.nativeElement.value != "")
    {
      this.especialidad.nativeElement.value = "";
      this.especialista.especialiadad = this.select.nativeElement.value;
    }
    else if(this.especialidad.nativeElement.value == "")
    {
      this.especialista.especialiadad = "";
    }
  }

  Especialidad()
  {
    if(this.especialidad.nativeElement.value != "")
    {
      this.select.nativeElement.value = "";
      this.especialista.especialiadad = this.especialidad.nativeElement.value;
    }
    else if(this.select.nativeElement.value == "")
    {
      this.especialista.especialiadad = "";
    }
  }

  Registrarse()
  {
    if(this.formGroup.status == "VALID")
    {
      if(this.especialista.especialiadad != "")
      {
        this.firebase.RegistrarUsuario(this.especialista.email, this.especialista.contra)
        .then(async(res)=> 
        {
          this.especialista.foto = await this.GuardarImagen(this.file);
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
              this.global.RestaurarAdmin("Especialista creado, tiene que verificar el mail");
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

  async GuardarImagen(foto : any)
  {
    let path : string = "especialista/"+ this.especialista.dni+Date.now()+"."+foto.name.split(".").pop();
    const imagReferencia = ref(this.storage, path);
    return uploadBytes(imagReferencia, foto)
    .then(()=>
    {
      return getDownloadURL(imagReferencia);
    })
    .catch((error)=>
    {
      console.log(error);
    });
  }

  imgUpload(event: any) 
  {
    const auxFile: File = event.target.files[0];
    this.file = auxFile;
  }
}
