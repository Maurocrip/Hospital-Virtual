import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validarRolGuard } from './validar-rol.guard';

describe('validarRolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validarRolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
