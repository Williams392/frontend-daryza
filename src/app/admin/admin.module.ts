import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ProductoComponent } from './gestion-inventario/producto/producto/producto.component';
import { NewProductoComponent } from './gestion-inventario/producto/new-producto/new-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { UnidadMedidaComponent } from './gestion-inventario/unidad-medida/unidad-medida.component';
import { MarcaComponent } from './gestion-inventario/marca/marca.component';
import { CategoriaComponent } from './gestion-inventario/categoria/categoria.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    ProductoComponent,
    NewProductoComponent,
    UnidadMedidaComponent,
    MarcaComponent,
    CategoriaComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    HttpClientModule,
    ReactiveFormsModule,

    FormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,

  ]
})
export class AdminModule { }
