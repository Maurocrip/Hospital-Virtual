import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsuariosComponent } from 'src/app/componente/usuarios/usuarios.component';
import { EstadisticasComponent } from 'src/app/componente/estadisticas/estadisticas.component';

const routes: Routes = [{ path: '', component: AdminComponent, children: 
[
  {path: "usuario", component: UsuariosComponent},
  {path: "estadistica", component: EstadisticasComponent}  
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
