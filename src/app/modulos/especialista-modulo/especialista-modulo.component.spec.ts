import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaModuloComponent } from './especialista-modulo.component';

describe('EspecialistaModuloComponent', () => {
  let component: EspecialistaModuloComponent;
  let fixture: ComponentFixture<EspecialistaModuloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspecialistaModuloComponent]
    });
    fixture = TestBed.createComponent(EspecialistaModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
