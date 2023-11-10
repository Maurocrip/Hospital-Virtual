import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Admin } from '../Clases/Admin';
import { Paciente } from '../Clases/Paciente';
import { Especialista } from '../Clases/Especialista';
import { Turno } from '../Clases/Turno';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  readonly auth = getAuth();
  readonly colPacientes = collection(this.firestore, 'pacientes');
  readonly colEspecialidades = collection(this.firestore, 'especialidades');
  readonly colUsuarios = collection(this.firestore, 'usuario');
  readonly colEspecialistas = collection(this.firestore, 'especialistas');
  readonly colAdmin = collection(this.firestore, 'admin');
  readonly colTurnos = collection(this.firestore, 'turnos');
  constructor(public firestore: Firestore) { }
  
  //-----------------------------------------------TRAER------------------------------------------------------------------------------------------
  TraerPacientes()
  { 
    return collectionData(this.colPacientes);
  }

  TraerTurnos()
  { 
    return collectionData(this.colTurnos);
  }

  TraerEspecialidades()
  { 
    return collectionData(this.colEspecialidades);
  }

  TraerAdmin()
  { 
    return collectionData(this.colAdmin);
  }

  TraerEspecialista()
  { 
    return collectionData(this.colEspecialistas);
  }

  TraerUsuarios()
  { 
    return collectionData(this.colUsuarios);
  }

  //-----------------------------------------------LOGINS-----------------------------------------------------------------------------------------
  RegistrarUsuario( email : string, pasword: string)
  {
    return createUserWithEmailAndPassword(this.auth, email, pasword);
  }
  
  LogIn(email : string, pasword: string)
  {
    return signInWithEmailAndPassword(this.auth, email, pasword);
  }
  
  DesLogueo(auth : Auth)
  {
    return signOut(auth);
  }

  //-----------------------------------------------GUARDAR----------------------------------------------------------------------------------------
  GuardarPaciente(paciente : Paciente) : void
  {
    const documento = doc(this.colPacientes);
    const id = documento.id;
    setDoc(documento,{Nombre: paciente.nombre, Email: paciente.email, Id: id, Apellido: paciente.apellido, Edad: paciente.edad, Dni: paciente.dni, ObraSocial: paciente.obraSocial, Contra: paciente.contra, Foto2: paciente.foto2, Foto1: paciente.foto1});
    this.GuardarUsuario(paciente.email, "paciente");
  }

  GuardarEspecialista(especialista : Especialista) : void
  {
    const documento = doc(this.colEspecialistas);
    const id = documento.id;
    setDoc(documento,{Nombre: especialista.nombre, Email: especialista.email, Id: id, Apellido: especialista.apellido, Edad: especialista.edad, Dni: especialista.dni, Especialidad: especialista.especialiadad, Contra: especialista.contra, Foto: especialista.foto, Estado : especialista.estado});
    this.GuardarUsuario(especialista.email, "especialista");
  }

  async GuardarAdministrador(admin : Admin) 
  {
    const documento = doc(this.colAdmin);
    const id = documento.id;
    await setDoc(documento,{Nombre: admin.nombre, Email: admin.email, Id: id, Apellido: admin.apellido, Edad: admin.edad, Dni: admin.dni, Contra: admin.contra, Foto: admin.foto});
    await this.GuardarUsuario(admin.email, "admin");
  }

  private async GuardarUsuario(email : string, tipo : string)
  {
    const documento = doc(this.colUsuarios);
    const id = documento.id;
    await setDoc(documento,{ Email: email, Id: id, Tipo: tipo});
  }

  GuardarEspecialidades(especialiadad : String) : void
  {
    const documento = doc(this.colEspecialidades);
    const id = documento.id;
    setDoc(documento,{ Especialidad: especialiadad });
  }

  GuardarTurnos(turno : Turno) : void
  {
    const documento = doc(this.colTurnos);
    const id = documento.id;
    setDoc(documento,{ Año: turno.fecha?.year, Mes: turno.fecha?.mes, Dia: turno.fecha?.dia, Id: id, Especialista : turno.nombreEsp, Paciente : turno.nombrePas, Especialidad : turno.especialidad, EmailEspecialista : turno.emailEsp, EmailPaciente: turno.emailPas, Estado : turno.estado});
  }
//-----------------------------------------------MODIFICAR----------------------------------------------------------------------------------------
  ModificarEspecialista( docId: string, estado : string) 
  {
    const docRef = doc(this.firestore, 'especialistas', docId);
    return updateDoc(docRef, {Estado : estado });
  }
  
  ModificarTurno( docId: string, estado : string) 
  {
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Estado : estado });
  }
}

