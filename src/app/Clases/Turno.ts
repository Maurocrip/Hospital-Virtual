import { Diagnostico } from "./Diagnostico";
import { Encuesta } from "./Encuesta";
import { Fecha } from "./Fecha";

export class Turno 
{
  public fecha : Fecha;
  public nombreEsp : string;
  public nombrePas : string;
  public especialidad : string;
  public emailEsp : string;
  public estado : string;
  public emailPas: string;
  public comentario: string;
  public calificacion: string;
  public id : string;
  public encuesta : Encuesta;
  public diagnostico : Diagnostico;

  constructor(fecha : Fecha = new Fecha, especialistaNombre : string ="", pacienteNombre : string ="", especialistaEmail : string ="", 
  pacienteEmail : string ="", especialidad : string ="", estado : string ="Esperando", id : string = "", reseña : string ="",
   diagnostico : Diagnostico = new Diagnostico, calificacion : string ="", encuesta : Encuesta = new Encuesta) 
  {
    this.encuesta = encuesta;
    this.fecha = fecha;
    this.nombreEsp = especialistaNombre;
    this.nombrePas = pacienteNombre;
    this.emailEsp = especialistaEmail;
    this.emailPas = pacienteEmail;
    this.especialidad = especialidad;
    this.estado = estado;
    this.comentario = reseña;
    this.id = id;
    this.diagnostico = diagnostico;
    this.calificacion = calificacion;
  }
}