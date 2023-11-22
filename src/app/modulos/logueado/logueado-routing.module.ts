import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogueadoComponent } from './logueado.component';
import { SolicitarTurnosComponent } from 'src/app/componente/turnos/solicitar-turnos/solicitar-turnos.component';
import { UsuariosComponent } from 'src/app/componente/usuarios/usuarios.component';
import { MostrarComponent } from 'src/app/componente/turnos/mostrar/mostrar.component';
import { PerfilEspecialistaComponent } from 'src/app/componente/perfil/perfil-especialista/perfil-especialista.component';
import { PerfilPacienteComponent } from 'src/app/componente/perfil/perfil-paciente/perfil-paciente.component';
import { PacientesComponent } from 'src/app/componente/pacientes/pacientes.component';

const routes: Routes = [{ path: '', component: LogueadoComponent, children: 
[
  {path: "solicitar", component: SolicitarTurnosComponent},   
  {path: "mostrarTurnos", component: MostrarComponent}  
] },
{ path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
{ path: 'paciente', loadChildren: () => import('../paciente-modulo/paciente-modulo.module').then(m => m.PacienteModuloModule) },
{ path: 'especialista', loadChildren: () => import('../especialista-modulo/especialista-modulo.module').then(m => m.EspecialistaModuloModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogueadoRoutingModule { }
