import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { UnidadMedidaComponent } from './gestion-almacen/unidad-medida/unidad-medida.component';
import { MarcaComponent } from './gestion-almacen/marca/marca.component';
import { CategoriaComponent } from './gestion-almacen/categoria/categoria.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProductoComponent } from './gestion-almacen/producto/producto.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { ClienteComponent } from './cliente/cliente.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    UnidadMedidaComponent,
    MarcaComponent,
    CategoriaComponent,
    ProductoComponent,
    AdminUsersComponent,
    ClienteComponent,
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
