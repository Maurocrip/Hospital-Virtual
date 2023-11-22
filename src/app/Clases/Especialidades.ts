export class Especialidades 
{
  public nombre : string;
  public foto : string | void;
  constructor(nombre : string = "", foto : string = "") 
  {
    this.nombre = nombre;
    this.foto =foto;
  }
}