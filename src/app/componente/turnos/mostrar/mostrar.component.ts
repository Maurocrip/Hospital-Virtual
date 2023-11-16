import { Component, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarComponent
{
  @ViewChild('texto') texto: any;
  public escritura : string = "";
  public id : string = "";
  private estado : string ="";
  public mostrar : boolean = false;
  constructor( public global : GlobalService, public firebase : FirebaseService){}

  Cargar()
  {
    this.firebase.ModificarTurnoReseña(this.id, { estado: this.estado, reseña :this.texto.nativeElement.value});
    this.mostrar=false;
  }

  Mostrar(objeto : any)
  {
    this.mostrar = objeto.Valor;
    this.escritura = objeto.Texto;
    this.id = objeto.Id;
    this.estado = objeto.Estado;
    console.log(this.id);
  }

  Volver()
  {
    this.mostrar = false;
  }
}
