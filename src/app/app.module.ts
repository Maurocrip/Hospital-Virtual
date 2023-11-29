import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componente/login/login.component';
import { RegistroComponent } from './componente/registro/registro.component';
import { PasientesComponent } from './componente/registro/pasientes/pasientes.component';
import { AdminComponent } from './componente/registro/admin/admin.component';
import { EspecialistasComponent } from './componente/registro/especialistas/especialistas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './componente/home/home.component';
import { VeriEspecilistaComponent } from './componente/verificacion/veri-especilista/veri-especilista.component';
import { VeriPasieteComponent } from './componente/verificacion/veri-pasiete/veri-pasiete.component';
import { UsuariosComponent } from './componente/usuarios/usuarios.component';
import { SolicitarTurnosComponent } from './componente/turnos/solicitar-turnos/solicitar-turnos.component';
import { TurnosPacienteComponent } from './componente/turnos/mostrar/turnos-paciente/turnos-paciente.component';
import { TurnosAdminComponent } from './componente/turnos/mostrar/turnos-admin/turnos-admin.component';
import { TurnosEspecialistaComponent } from './componente/turnos/mostrar/turnos-especialista/turnos-especialista.component';
import { MostrarComponent } from './componente/turnos/mostrar/mostrar.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { PerfilPacienteComponent } from './componente/perfil/perfil-paciente/perfil-paciente.component';
import { PerfilEspecialistaComponent } from './componente/perfil/perfil-especialista/perfil-especialista.component';
import { TablaPacienteComponent } from './componente/tabla-paciente/tabla-paciente.component';
import { PacientesComponent } from './componente/pacientes/pacientes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EstadisticasComponent } from './componente/estadisticas/estadisticas.component';
import { FechaFormatoPipe } from './pipes/fecha-formato.pipe';
import { MayusculaPrimeraletraPipe } from './pipes/mayuscula-primeraletra.pipe';
import { HoraFormatoPipe } from './pipes/hora-formato.pipe';
import { BotonHoverDirective } from './directivas/boton-hover.directive';
import { NavBarDirective } from './directivas/nav-bar.directive';
import { ColorEstadosDirective } from './directivas/color-estados.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    PasientesComponent,
    AdminComponent,
    EspecialistasComponent,
    HomeComponent,
    VeriEspecilistaComponent,
    VeriPasieteComponent,
    UsuariosComponent,
    SolicitarTurnosComponent,
    UsuariosComponent,
    TurnosPacienteComponent,
    TurnosAdminComponent,
    TurnosEspecialistaComponent,
    MostrarComponent,
    PerfilPacienteComponent,
    PerfilEspecialistaComponent,
    TablaPacienteComponent,
    PacientesComponent,
    EstadisticasComponent,
    FechaFormatoPipe,
    MayusculaPrimeraletraPipe,
    HoraFormatoPipe,
    BotonHoverDirective,
    NavBarDirective,
    ColorEstadosDirective,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    RecaptchaModule,
    BrowserAnimationsModule 
  ],
  providers: [
    {
			provide: RECAPTCHA_SETTINGS,
			useValue: {
				siteKey: '6LeW9hApAAAAAI9hq9UoSMgfbvHsHgSltie1JcVQ',
			} as RecaptchaSettings,
		}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
