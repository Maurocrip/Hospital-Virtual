import { ApplicationConfig, NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { LoginComponent } from './componente/login/login.component';
import { RegistroComponent } from './componente/registro/registro.component';
import { HomeComponent } from './componente/home/home.component';
import { VeriPasieteComponent } from './componente/verificacion/veri-pasiete/veri-pasiete.component';
import { VeriEspecilistaComponent } from './componente/verificacion/veri-especilista/veri-especilista.component';


const routes: Routes = 
[
  {path: "login", component: LoginComponent, data: { animation: 'login' }}, 
  {path: "registro", component: RegistroComponent, data: { animation: 'registro' }},
  {path: "validacionPas", component: VeriPasieteComponent},  
  {path: "validacionEsp", component: VeriEspecilistaComponent}, 
  {path: "home", component: HomeComponent, data: { animation: 'home' }},  
  { path: 'logueado', loadChildren: () => import('./modulos/logueado/logueado.module').then(m => m.LogueadoModule)},
  {path: '', redirectTo: "login", pathMatch: "full"},
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
