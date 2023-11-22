import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogueadoRoutingModule } from './logueado-routing.module';
import { LogueadoComponent } from './logueado.component';


@NgModule({
  declarations: [
    LogueadoComponent
  ],
  imports: [
    CommonModule,
    LogueadoRoutingModule
  ]
})
export class LogueadoModule { }
