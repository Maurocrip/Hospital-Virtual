import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeriEspecilistaComponent } from './veri-especilista.component';

describe('VeriEspecilistaComponent', () => {
  let component: VeriEspecilistaComponent;
  let fixture: ComponentFixture<VeriEspecilistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VeriEspecilistaComponent]
    });
    fixture = TestBed.createComponent(VeriEspecilistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
