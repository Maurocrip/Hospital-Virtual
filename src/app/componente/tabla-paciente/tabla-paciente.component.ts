import { Component, Input } from '@angular/core';
import { Turno } from 'src/app/Clases/Turno';

@Component({
  selector: 'app-tabla-paciente',
  templateUrl: './tabla-paciente.component.html',
  styleUrls: ['./tabla-paciente.component.css']
})
export class TablaPacienteComponent 
{
  @Input() arrayTurnos : Array<Turno> = [];
}
