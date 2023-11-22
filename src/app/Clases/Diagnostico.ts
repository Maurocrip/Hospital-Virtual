export class Diagnostico 
{
  public peso : number;
  public altura : number;
  public temperatura : number;
  public presion : number;
  public diagnostico : string;
  public extras : Array<any>;
  constructor(peso : number = 0, altura : number =0, diagnostico : string = "", temperatura : number =0, presion : number =0, extras : Array<any> = []) 
  {
    this.peso = peso;
    this.altura =altura;
    this.diagnostico = diagnostico;
    this.temperatura =temperatura;
    this.presion =presion;
    this.extras = extras;
  }
}