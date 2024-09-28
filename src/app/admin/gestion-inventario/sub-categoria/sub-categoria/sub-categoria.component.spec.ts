import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriaComponent } from './sub-categoria.component';

describe('SubCategoriaComponent', () => {
  let component: SubCategoriaComponent;
  let fixture: ComponentFixture<SubCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
