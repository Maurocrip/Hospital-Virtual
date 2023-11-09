export class Admin 
{
  public nombre : string = "";
  public apellido : string = "";
  public email : string = "";
  public edad : number = 0;
  public dni : number = 0;
  public contra : string = "";
  public foto : string | void;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, contra : string = "", foto : string = "")
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.contra = contra;
    this.foto = foto;
  }
}