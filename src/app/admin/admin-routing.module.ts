import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

import { MarcaComponent } from './gestion-almacen/marca/marca.component';
import { CategoriaComponent } from './gestion-almacen/categoria/categoria.component';
import { UnidadMedidaComponent } from './gestion-almacen/unidad-medida/unidad-medida.component';
import { AuthenticatedGuard } from '../auth/auth.guard'; 
import { ProductoComponent } from './gestion-almacen/producto/producto.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthenticatedGuard], 
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      { path: 'productos', component: ProductoComponent},
      { path: 'marcas', component: MarcaComponent},
      { path: 'categoria', component: CategoriaComponent},
      { path: 'unidad_medida', component: UnidadMedidaComponent},

      { path: 'usuarios', component: AdminUsersComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
