import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarcaComponent } from './new-marca.component';

describe('NewMarcaComponent', () => {
  let component: NewMarcaComponent;
  let fixture: ComponentFixture<NewMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMarcaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
