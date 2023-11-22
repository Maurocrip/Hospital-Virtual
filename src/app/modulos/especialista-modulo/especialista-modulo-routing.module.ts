import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialistaModuloComponent } from './especialista-modulo.component';
import { PacientesComponent } from 'src/app/componente/pacientes/pacientes.component';
import { PerfilEspecialistaComponent } from 'src/app/componente/perfil/perfil-especialista/perfil-especialista.component';

const routes: Routes = [{ path: '', component: EspecialistaModuloComponent, children:
[
  {path: "pacientes", component: PacientesComponent},
  {path: "perfilEspe", component: PerfilEspecialistaComponent},  
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialistaModuloRoutingModule { }
