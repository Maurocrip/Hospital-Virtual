import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormato'
})
export class FechaFormatoPipe implements PipeTransform 
{
  
  transform(value: any, arg: number): unknown 
  {
    switch(arg)
    {
      case 1:
        let prueba = value.toDate();
        value = prueba.getDate()+"/"+prueba.getMonth()+"/"+prueba.getFullYear();
      break;

      case 2:
        value = value.year+"-"+value.mes+"-"+value.dia+" "+value.hora;
      break;
    }
    return value;
  }

}
