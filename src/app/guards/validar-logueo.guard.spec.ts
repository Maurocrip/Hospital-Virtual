import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validarLogueoGuard } from './validar-logueo.guard';

describe('validarLogueoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validarLogueoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
