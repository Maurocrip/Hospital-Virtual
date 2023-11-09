import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { Router } from '@angular/router';
import { ErroresService } from 'src/app/servicios/errores.service';

@Component({
  selector: 'app-veri-especilista',
  templateUrl: './veri-especilista.component.html',
  styleUrls: ['./veri-especilista.component.css']
})
export class VeriEspecilistaComponent
{
  constructor(private router: Router, private firebase : FirebaseService, private global : GlobalService, private error : ErroresService){}

  async Verificar()
  {
    await this.firebase.auth.currentUser?.reload();
    console.log(this.firebase.auth.currentUser);
    if(this.firebase.auth.currentUser?.emailVerified)
    {
      for(let element of this.global.arrayEspecialista)
      {
        if(element.email == this.firebase.auth.currentUser?.email)
        {
          if(element.estado == "habilitado")
          {
            this.global.UsuarioLogueado("especialista",element);
            break;
          }
          else
          {
            this.error.MostrarError("AD");
            this.router.navigate(['login']);
          }
        }
      }
    }
    else
    {
      this.error.MostrarError("NV");
    }
  }
}
