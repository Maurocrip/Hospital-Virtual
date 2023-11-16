import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componente/login/login.component';
import { RegistroComponent } from './componente/registro/registro.component';
import { HomeComponent } from './componente/home/home.component';
import { VeriPasieteComponent } from './componente/verificacion/veri-pasiete/veri-pasiete.component';
import { VeriEspecilistaComponent } from './componente/verificacion/veri-especilista/veri-especilista.component';
import { UsuariosComponent } from './componente/usuarios/usuarios.component';
import { SolicitarTurnosComponent } from './componente/turnos/solicitar-turnos/solicitar-turnos.component';
import { TurnosPacienteComponent } from './componente/turnos/mostrar/turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from './componente/turnos/mostrar/turnos-especialista/turnos-especialista.component';
import { TurnosAdminComponent } from './componente/turnos/mostrar/turnos-admin/turnos-admin.component';
import { PerfilComponent } from './componente/perfil/perfil.component';
import { MostrarComponent } from './componente/turnos/mostrar/mostrar.component';

const routes: Routes = 
[
  {path: "login", component: LoginComponent}, 
  {path: "registro", component: RegistroComponent},
  {path: "validacionPas", component: VeriPasieteComponent},  
  {path: "validacionEsp", component: VeriEspecilistaComponent},  
  {path: "home", component: HomeComponent},  
  {path: "usuario", component: UsuariosComponent},  
  {path: "solicitar", component: SolicitarTurnosComponent},  
  {path: "mostrarTurnos", component: MostrarComponent},   
  {path: "perfil", component: PerfilComponent},   
  {path: '', redirectTo: "login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
