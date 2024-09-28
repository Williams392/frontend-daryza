import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MarcasComponent } from './gestion-inventario/marca/marcas/marcas.component';
import { NewMarcaComponent } from './gestion-inventario/marca/new-marca/new-marca.component';
import { CategoriasComponent } from './gestion-inventario/categoria/categorias/categorias.component';
import { NewCategoriaComponent } from './gestion-inventario/categoria/new-categoria/new-categoria.component';
import { UnidadMedidaComponent } from './gestion-inventario/unidad-medida/unidad-medida/unidad-medida.component';
import { NewUnidadMedidaComponent } from './gestion-inventario/unidad-medida/new-unidad-medida/new-unidad-medida.component';
import { SubCategoriaComponent } from './gestion-inventario/sub-categoria/sub-categoria/sub-categoria.component';
import { NewSubCategoriaComponent } from './gestion-inventario/sub-categoria/new-sub-categoria/new-sub-categoria.component';
import { ProductoComponent } from './gestion-inventario/producto/producto/producto.component';
import { NewProductoComponent } from './gestion-inventario/producto/new-producto/new-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    MarcasComponent,
    NewMarcaComponent,
    CategoriasComponent,
    NewCategoriaComponent,
    UnidadMedidaComponent,
    NewUnidadMedidaComponent,
    SubCategoriaComponent,
    NewSubCategoriaComponent,
    ProductoComponent,
    NewProductoComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    HttpClientModule,
    ReactiveFormsModule,

    FormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSnackBarModule

  ]
})
export class AdminModule { }
