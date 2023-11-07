import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Admin, Especialista, Paciente } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  readonly auth = getAuth();
  readonly colPacientes = collection(this.firestore, 'pacientes');
  readonly colUsuarios = collection(this.firestore, 'usuario');
  readonly colEspecialistas = collection(this.firestore, 'especialistas');
  readonly colAdmin = collection(this.firestore, 'admin');
  constructor(public firestore: Firestore) { }
  
  //-----------------------------------------------TRAER------------------------------------------------------------------------------------------
  TraerPacientes()
  { 
    return collectionData(this.colPacientes);
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

  GuardarAdministrador(admin : Admin) : void
  {
    const documento = doc(this.colAdmin);
    const id = documento.id;
    setDoc(documento,{Nombre: admin.nombre, Email: admin.email, Id: id, Apellido: admin.apellido, Edad: admin.edad, Dni: admin.dni, Contra: admin.contra, Foto: admin.foto});
    this.GuardarUsuario(admin.email, "admin");
  }

  private GuardarUsuario(email : string, tipo : string)
  {
    const documento = doc(this.colUsuarios);
    const id = documento.id;
    setDoc(documento,{ Email: email, Id: id, Tipo: tipo});
  }
//-----------------------------------------------MODIFICAR----------------------------------------------------------------------------------------
  ModificarEspecialista( docId: string, estado : string) 
  {
    const docRef = doc(this.firestore, 'especialistas', docId);
    return updateDoc(docRef, {Estado : estado });
  }
}

