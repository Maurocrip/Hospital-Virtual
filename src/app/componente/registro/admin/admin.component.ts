import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { Admin } from 'src/app/Clases/Admin';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent
{
  public admin : Admin = new Admin;
  public file : File | undefined;
  public formGroup : FormGroup;
  constructor( private fb : FormBuilder, private firebase : FirebaseService, private errores : ErroresService, private storage : Storage, private global: GlobalService)
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

  Registrarse()
  {
    if(this.formGroup.status == "VALID")
    {
      let user : any = this.firebase.auth.currentUser;
      this.firebase.RegistrarUsuario(this.admin.email, this.admin.contra)
      .then(async()=> 
      {
        this.admin.foto = await this.GuardarImagen(this.file);
        await this.firebase.GuardarAdministrador(this.admin);
        this.global.RestaurarAdmin("Administrador creado", user);
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
    let path : string = "admistrador/"+ this.admin.dni+Date.now()+"."+foto.name.split(".").pop();
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
