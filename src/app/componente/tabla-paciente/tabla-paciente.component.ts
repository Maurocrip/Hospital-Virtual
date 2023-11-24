import { Component, Input } from '@angular/core';
import { Turno } from 'src/app/Clases/Turno';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-tabla-paciente',
  templateUrl: './tabla-paciente.component.html',
  styleUrls: ['./tabla-paciente.component.css']
})
export class TablaPacienteComponent 
{
  constructor(public global : GlobalService){}
  @Input() arrayTurnos : Array<Turno> = [];
}
