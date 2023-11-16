export class Especialista 
{
  public id : string;
  public nombre : string ;
  public apellido : string ;
  public email : string;
  public edad : number ;
  public dni : number;
  public contra : string;
  public especialiadad : Array<string>;
  public diasHabiles : Array<any>;
  public foto : string | void;
  public estado : string;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, especialiadad : Array<string> = [], contra : string = "", foto : string = "", estado : string = "denegado", id = "", diasHabiles : Array<any> = [])
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.especialiadad = especialiadad;
    this.contra = contra;
    this.foto = foto;
    this.estado = estado;
    this.id = id;
    this.diasHabiles = diasHabiles;
  }
}