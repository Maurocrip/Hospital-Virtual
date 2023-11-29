import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mayusculaPrimeraletra'
})
export class MayusculaPrimeraletraPipe implements PipeTransform 
{
  transform(value: string, ...args: unknown[]): unknown 
  {
    return value[0].toUpperCase() + value.slice(1);
  }
}
