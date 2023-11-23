export class Encuesta
{
  public recomendacion : string;
  public atencion : number;
  public horarioRespetado : boolean;
  public higiene : string;

  constructor(recomendacion : string = "", atencion : number =0, higiene : string = "", horarioRespetado : boolean =false)
  {
    this.recomendacion = recomendacion;
    this.atencion = atencion;
    this.horarioRespetado = horarioRespetado;
    this.higiene = higiene;
  }
}