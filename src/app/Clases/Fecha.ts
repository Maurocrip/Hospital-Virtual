export class Fecha 
{
  public dia : number;
  public mes : number;
  public year : number;
  public hora : string;
  constructor(dia : number = -1, mes : number =-1, year : number=-1, hora : string = "0") 
  {
    this.dia = dia;
    this.mes =mes;
    this.year =year;
    this.hora = hora;
  }

  public FechaToString() : string
  {
    let retorno = "";
    if (this.dia>=10)
    {
      retorno = this.dia + "/"+ this.mes + "/" +this.year;
    }
    else
    {
      retorno = "0"+ this.dia + "/"+ this.mes + "/" +this.year;
    }

    return retorno;
  }
}