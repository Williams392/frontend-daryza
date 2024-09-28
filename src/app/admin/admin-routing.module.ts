import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { MarcasComponent } from './gestion-inventario/marca/marcas/marcas.component';
import { NewMarcaComponent } from './gestion-inventario/marca/new-marca/new-marca.component';
import { ProductoComponent } from './gestion-inventario/producto/producto/producto.component';
import { NewProductoComponent } from './gestion-inventario/producto/new-producto/new-producto.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      { path: 'productos', component: ProductoComponent},
      { path: 'newproductos', component: NewProductoComponent},

      { path: 'marcas', component: MarcasComponent},
      { path: 'newmarca', component: NewMarcaComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
