import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogueadoComponent } from './logueado.component';
import { SolicitarTurnosComponent } from 'src/app/componente/turnos/solicitar-turnos/solicitar-turnos.component';
import { MostrarComponent } from 'src/app/componente/turnos/mostrar/mostrar.component';
import { validarLogueoGuard } from 'src/app/guards/validar-logueo.guard';

const routes: Routes = [{ path: '', component: LogueadoComponent, children: 
[
  {path: "solicitar", component: SolicitarTurnosComponent},   
  {path: "mostrarTurnos", component: MostrarComponent}  
],canActivate: [validarLogueoGuard] },
{ path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
{ path: 'paciente', loadChildren: () => import('../paciente-modulo/paciente-modulo.module').then(m => m.PacienteModuloModule) },
{ path: 'especialista', loadChildren: () => import('../especialista-modulo/especialista-modulo.module').then(m => m.EspecialistaModuloModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogueadoRoutingModule { }
