import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { Especialista } from 'src/app/Clases/Especialista';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})

export class EspecialistasComponent implements OnInit
{ 
  public arrayEspecialidades : any = [] ;
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
      //especial :["",[this.noTieneNumeros]],
      foto :["",[Validators.required]]
    });
  }

  ngOnInit(): void 
  {
    this.firebase.TraerEspecialidades()
    .subscribe((respuesta)=>
    {
      this.arrayEspecialidades =[];
      for(let element of respuesta)
      {
        this.arrayEspecialidades.push(element["Especialidad"]);         
      }
    });
  };

  Selecion()
  {
    this.especialista.especialiadad = this.select.nativeElement.value;
  }

  AgregarEspecialidad()
  {
    if(this.especialidad.nativeElement.value.replaceAll(" ", "")!="")
    {
      this.firebase.GuardarEspecialidades(this.especialidad.nativeElement.value);
      this.especialidad.nativeElement.value = "";
    }
  }

  Registrarse()
  {
    if(this.formGroup.status == "VALID")
    {
      if(this.especialista.especialiadad != "")
      {
        let user : any = this.firebase.auth.currentUser;
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

  /*private noTieneNumeros(control : AbstractControl): null | object
  {
    let nombre : string = control.value;
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(nombre); 
    console.log(onlyNumbers)// true
    if(onlyNumbers)
    {
      return {contieneNumeros:true}
    }
    else
    {
      return null
    }
  }*/
}
