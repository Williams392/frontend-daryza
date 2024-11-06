import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Importa el módulo para pruebas HTTP
import { FormsModule } from '@angular/forms'; // Importa el módulo para formularios
import { CategoriaComponent } from './categoria.component';

import { of } from 'rxjs';
import { CategoriaService } from '../../../core/services/categoria.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;
  let categoriaService: CategoriaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [CategoriaComponent],
    imports: [FormsModule],
    providers: [CategoriaService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;
    categoriaService = TestBed.inject(CategoriaService); // Inyecta el servicio
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
