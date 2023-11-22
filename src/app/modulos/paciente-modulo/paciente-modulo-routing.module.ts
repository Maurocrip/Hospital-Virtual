import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteModuloComponent } from './paciente-modulo.component';
import { PerfilPacienteComponent } from 'src/app/componente/perfil/perfil-paciente/perfil-paciente.component';

const routes: Routes = [{ path: '', component: PacienteModuloComponent, children: [
  {path: "perfilPas", component: PerfilPacienteComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteModuloRoutingModule { }
