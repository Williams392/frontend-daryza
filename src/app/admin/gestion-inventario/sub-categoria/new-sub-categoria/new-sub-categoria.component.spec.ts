import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubCategoriaComponent } from './new-sub-categoria.component';

describe('NewSubCategoriaComponent', () => {
  let component: NewSubCategoriaComponent;
  let fixture: ComponentFixture<NewSubCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSubCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
