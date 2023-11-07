import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeriPasieteComponent } from './veri-pasiete.component';

describe('VeriPasieteComponent', () => {
  let component: VeriPasieteComponent;
  let fixture: ComponentFixture<VeriPasieteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VeriPasieteComponent]
    });
    fixture = TestBed.createComponent(VeriPasieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
