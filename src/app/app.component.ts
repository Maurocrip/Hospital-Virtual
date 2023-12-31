import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './servicios/firebase.service';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { GlobalService } from './servicios/global.service';
import { slideInAnimation } from './animaciones/animation';
import { ErroresService } from './servicios/errores.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements OnInit
{
  public perfil = false;

  constructor(private firebase : FirebaseService, private router: Router, public global : GlobalService, private contexts: ChildrenOutletContexts, private errores : ErroresService){}
  ngOnInit(): void 
  {
    if(this.global.usuario!="")
    {
      this.perfil = true;
    }
  }

  getRouteAnimationData() 
  {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  LogOut()
  {
    this.firebase.DesLogueo(this.firebase.auth);
    this.perfil = false;
    this.global.tipo ="";
    this.global.usuario="";
    this.errores.Generartost("Nos vemos","success","pink");
    this.router.navigate(['login']);
  }
}
