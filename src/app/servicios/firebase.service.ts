import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, OrderByDirection, collection, collectionData, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Admin } from '../Clases/Admin';
import { Paciente } from '../Clases/Paciente';
import { Especialista } from '../Clases/Especialista';
import { Turno } from '../Clases/Turno';
import { Encuesta } from '../Clases/Encuesta';
import { Especialidades } from '../Clases/Especialidades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  readonly auth = getAuth();
  readonly colLogins = collection(this.firestore, 'logins');
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

  getAllSnapshot<T=Array<any>>(collectionName: string, order:string, modo:OrderByDirection = 'desc'): Observable<T[]> 
  {    
    let docs = query(collection(this.firestore, collectionName), orderBy(order,modo));
    return new Observable(subscriber => 
    {
      const unsubscribe = onSnapshot(docs, querySnapshot => 
      {
        const collection: T[] = [];

        querySnapshot.forEach(doc => {
          const simpleDoc = { ...doc.data() as T };
          collection.push(simpleDoc);
        });

        subscriber.next(collection);
      });
      return () => unsubscribe();
    });
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

  GuardarEspecialidades(especialiadad : Especialidades) : void
  {
    const documento = doc(this.colEspecialidades);
    const id = documento.id;
    setDoc(documento,{ Especialidad: especialiadad.nombre, Foto : especialiadad.foto });
  }

  GuardarTurnos(turno : Turno) : void
  {
    const documento = doc(this.colTurnos);
    const id = documento.id;
    setDoc(documento,{ Año: turno.fecha?.year, Mes: turno.fecha?.mes, Dia: turno.fecha?.dia, Hora: turno.fecha?.hora, Id: id,
      Especialista : turno.nombreEsp, Paciente : turno.nombrePas, Especialidad : turno.especialidad, EmailEspecialista : turno.emailEsp,
      EmailPaciente: turno.emailPas, Estado : turno.estado, Comentario: turno.comentario,
      Diagnostico: {peso : turno.diagnostico.peso, altura : turno.diagnostico.altura, diagnostico : turno.diagnostico.diagnostico, extras : turno.diagnostico.extras}, Calificacion : turno.calificacion,
      Encuesta : {Recomendacion : turno.encuesta.recomendacion, Atencion : turno.encuesta.atencion, HorarioRespetado : turno.encuesta.horarioRespetado, Higiene : turno.encuesta.higiene}});
  }

  GuardarLogins(login : any) : void
  {
    const documento = doc(this.colLogins);
    const id = documento.id;
    setDoc(documento,{ Usuario: login.usuario, Fecha: login.fecha});
  }
//-----------------------------------------------MODIFICAR----------------------------------------------------------------------------------------
  ModificarEspecialistaEstado( docId: string, estado : string)
  {
    const docRef = doc(this.firestore, 'especialistas', docId);
    return updateDoc(docRef, {Estado : estado });
  }

  ModificarEspecialistaDias( docId: string, dias : Array<any>)
  {
    const docRef = doc(this.firestore, 'especialistas', docId);
    return updateDoc(docRef, {Trabaja : dias });
  }

  ModificarTurnoReseña( docId: string, turno : any)
  {
    console.log(turno);
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Estado : turno.estado, Comentario: turno.reseña});
  }

  ModificarTurnoEstado( docId: string, estado : string)
  {
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Estado : estado});
  }

  ModificarTurnoDiagnostico( docId: string, turno : any)
  {
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Estado : turno.estado, Comentario: turno.reseña, Diagnostico: turno.diagnostico});
  }

  ModificarTurnoCalificacion( docId: string, calificacion : string)
  {
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Calificacion : calificacion});
  }

  ModificarTurnoEncuesta( docId: string, encuesta : Encuesta)
  {
    const docRef = doc(this.firestore, 'turnos', docId);
    return updateDoc(docRef, {Encuesta : {Recomendacion : encuesta.recomendacion, Atencion : encuesta.atencion, HorarioRespetado : encuesta.horarioRespetado, Higiene : encuesta.higiene}});
  }
}

