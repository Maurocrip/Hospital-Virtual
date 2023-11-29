import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormato'
})
export class HoraFormatoPipe implements PipeTransform 
{

  transform(value: any, ...args: unknown[]): unknown 
  {
    let prueba = value.toDate();
    value = prueba.getHours()+":"+prueba.getMinutes()+":"+prueba.getSeconds();
    return value;
  }

}
