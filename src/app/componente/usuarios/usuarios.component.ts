import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Especialista } from 'src/app/Clases/Especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent
{
  constructor(private router: Router, private firebase : FirebaseService, public global : GlobalService){}

  Denegar(especialista : Especialista)
  {
    especialista.estado = "denegado";
    this.firebase.ModificarEspecialista(especialista.id,especialista.estado);
  }

  Aceptar(especialista : Especialista)
  {
    especialista.estado = "habilitado";
   this.firebase.ModificarEspecialista(especialista.id,especialista.estado);
  }

  NuevosUsuarios()
  {
    console.log(this.firebase.auth);
    this.router.navigate(['registro']);
  }
}
