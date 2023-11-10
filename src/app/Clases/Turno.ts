import { Fecha } from "./Fecha";

export class Turno 
{
  public fecha : Fecha | null;
  public nombreEsp : string;
  public nombrePas : string;
  public especialidad : string;
  public emailEsp : string;
  public estado : string;
  public emailPas: string;

  constructor(fecha : Fecha | null = null, especialistaNombre : string ="", pacienteNombre : string ="", especialistaEmail : string ="", pacienteEmail : string ="", especialidad : string ="", estado : string ="Esperando") 
  {
    this.fecha = fecha;
    this.nombreEsp = especialistaNombre;
    this.nombrePas = pacienteNombre;
    this.emailEsp = especialistaEmail;
    this.emailPas = pacienteEmail;
    this.especialidad = especialidad;
    this.estado = estado;
  }
}