import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacienteModuloRoutingModule } from './paciente-modulo-routing.module';
import { PacienteModuloComponent } from './paciente-modulo.component';


@NgModule({
  declarations: [
    PacienteModuloComponent
  ],
  imports: [
    CommonModule,
    PacienteModuloRoutingModule
  ]
})
export class PacienteModuloModule { }
