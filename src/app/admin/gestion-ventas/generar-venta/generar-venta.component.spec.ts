import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarVentaComponent } from './generar-venta.component';

describe('GenerarVentaComponent', () => {
  let component: GenerarVentaComponent;
  let fixture: ComponentFixture<GenerarVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerarVentaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
