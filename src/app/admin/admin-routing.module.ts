import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

import { ProductoComponent } from './gestion-inventario/producto/producto/producto.component';
import { NewProductoComponent } from './gestion-inventario/producto/new-producto/new-producto.component';
import { MarcaComponent } from './gestion-inventario/marca/marca.component';
import { CategoriaComponent } from './gestion-inventario/categoria/categoria.component';
import { UnidadMedidaComponent } from './gestion-inventario/unidad-medida/unidad-medida.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      { path: 'productos', component: ProductoComponent},
      { path: 'newproductos', component: NewProductoComponent},

      { path: 'marcas', component: MarcaComponent},

      { path: 'categoria', component: CategoriaComponent},

      { path: 'unidad_medida', component: UnidadMedidaComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
