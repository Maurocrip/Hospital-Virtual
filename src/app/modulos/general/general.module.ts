import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaPacienteComponent } from 'src/app/componente/tabla-paciente/tabla-paciente.component';

@NgModule({
  declarations: [TablaPacienteComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TablaPacienteComponent
  ]

})
export class GeneralModule { }
