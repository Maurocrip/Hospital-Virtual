import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { ErroresService } from 'src/app/servicios/errores.service';

@Component({
  selector: 'app-veri-pasiete',
  templateUrl: './veri-pasiete.component.html',
  styleUrls: ['./veri-pasiete.component.css']
})
export class VeriPasieteComponent
{
  constructor( private firebase : FirebaseService, private global : GlobalService, private errores : ErroresService){}

  async Verificar()
  {
    await this.firebase.auth.currentUser?.reload();
    console.log(this.firebase.auth.currentUser);
    this.global.VerificarMailPas(this.firebase.auth.currentUser?.emailVerified, false);
  }
}
