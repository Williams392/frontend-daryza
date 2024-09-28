import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriaComponent } from './new-categoria.component';

describe('NewCategoriaComponent', () => {
  let component: NewCategoriaComponent;
  let fixture: ComponentFixture<NewCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
