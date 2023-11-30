import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { GlobalService } from '../servicios/global.service';

@Injectable({providedIn: 'root'})
export class AdminGuard 
{
  constructor(private global : GlobalService) {}
  
  canActivate(root:any) : boolean
  {
    return this.global.tipo == root.data["rol"];
  }
};

export const validarRolGuard: CanActivateFn = (route, state) => {
  return inject(AdminGuard).canActivate(route);
};
