export class Paciente 
{
  public nombre : string = "";
  public apellido : string = "";
  public email : string = "";
  public edad : number = 0;
  public dni : number = 0;
  public obraSocial : string = "";
  public contra : string = "";
  public foto2 : string | void;
  public foto1 :  string | void;

  constructor(nombre : string = "", apellido : string = "", email : string = "", edad : number = 0, dni : number = 0, obraSocial : string = "", contra : string = "", foto2 : string = "", foto1 : string = "")
  {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.edad = edad;
    this.dni = dni;
    this.obraSocial = obraSocial;
    this.contra = contra;
    this.foto2 = foto2;
    this.foto1 = foto1;
  }
}