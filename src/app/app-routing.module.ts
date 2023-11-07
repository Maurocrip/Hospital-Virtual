import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componente/login/login.component';
import { RegistroComponent } from './componente/registro/registro.component';
import { HomeComponent } from './componente/home/home.component';
import { VeriPasieteComponent } from './componente/verificacion/veri-pasiete/veri-pasiete.component';
import { VeriEspecilistaComponent } from './componente/verificacion/veri-especilista/veri-especilista.component';
import { UsuariosComponent } from './componente/usuarios/usuarios.component';

const routes: Routes = 
[
  {path: "login", component: LoginComponent}, 
  {path: "registro", component: RegistroComponent},
  {path: "validacionPas", component: VeriPasieteComponent},  
  {path: "validacionEsp", component: VeriEspecilistaComponent},  
  {path: "tablaUsuarios", component: UsuariosComponent},  
  {path: "home", component: HomeComponent},  
  {path: "usuario", component: UsuariosComponent},  
  {path: '', redirectTo: "login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
