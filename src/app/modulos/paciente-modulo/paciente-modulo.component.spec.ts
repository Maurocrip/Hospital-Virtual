import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteModuloComponent } from './paciente-modulo.component';

describe('PacienteModuloComponent', () => {
  let component: PacienteModuloComponent;
  let fixture: ComponentFixture<PacienteModuloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteModuloComponent]
    });
    fixture = TestBed.createComponent(PacienteModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
