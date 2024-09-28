import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUnidadMedidaComponent } from './new-unidad-medida.component';

describe('NewUnidadMedidaComponent', () => {
  let component: NewUnidadMedidaComponent;
  let fixture: ComponentFixture<NewUnidadMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUnidadMedidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
