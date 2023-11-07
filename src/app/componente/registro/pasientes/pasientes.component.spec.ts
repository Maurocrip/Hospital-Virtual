import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasientesComponent } from './pasientes.component';

describe('PasientesComponent', () => {
  let component: PasientesComponent;
  let fixture: ComponentFixture<PasientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasientesComponent]
    });
    fixture = TestBed.createComponent(PasientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
