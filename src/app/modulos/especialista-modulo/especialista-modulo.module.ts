import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspecialistaModuloRoutingModule } from './especialista-modulo-routing.module';
import { EspecialistaModuloComponent } from './especialista-modulo.component';


@NgModule({
  declarations: [
    EspecialistaModuloComponent
  ],
  imports: [
    CommonModule,
    EspecialistaModuloRoutingModule
  ]
})
export class EspecialistaModuloModule { }
