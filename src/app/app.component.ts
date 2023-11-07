import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './servicios/firebase.service';
import { Router } from '@angular/router';
import { GlobalService } from './servicios/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public perfil = false;

  constructor(private firebase : FirebaseService, private router: Router, public global : GlobalService){}
  ngOnInit(): void 
  {
    if(this.global.usuario!="")
    {
      this.perfil = true;
    }
  }

  LogOut()
  {
    this.firebase.DesLogueo(this.firebase.auth);
    this.perfil = false;
    this.global.tipo ="";
    this.global.usuario="";
    this.router.navigate(['login']);
  }
}
