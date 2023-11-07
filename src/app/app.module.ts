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
    UsuariosComponent
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
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
