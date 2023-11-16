import { Component } from '@angular/core';
import { getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService  } from 'src/app/servicios/firebase.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';
import { ErroresService } from 'src/app/servicios/errores.service';
import Swal from 'sweetalert2';
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
        this.paciente.foto1 = await this.GuardarImagen(this.file1);
        this.paciente.foto2 = await this.GuardarImagen(this.file2);
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

  async GuardarImagen(foto : any)
  {
    let path : string = "pasientes/"+ this.paciente.dni+Date.now()+"."+foto.name.split(".").pop();
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


