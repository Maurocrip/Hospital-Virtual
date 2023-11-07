import { Component } from '@angular/core';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public nombre : string;
  public tipo : string;
  constructor(private global : GlobalService)
  {
    this.nombre = this.global.usuario.nombre;
    this.tipo = this.global.tipo;
  }
} 
