import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../auth/auth.service'; // Asegúrate de importar AuthService
//import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  isCollapsed = false;
  isGestionMenuOpen = false;
  isVentasMenuOpen = false;
  isMovimientosMenuOpen = false;
  username: string | null = null;
  role: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.checkActiveRoutes();
        }
    });

    // Obtener username y role del localStorage
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion() {
    this.authService.logout(); // Llama al método logout() de AuthService
    this.router.navigate(['login/']); // Redirige a la página de login
  }

  // PARA CADA UNO --------------------------------------------
  toggleGestionMenu(event: Event) { // NO MOVER
    event.preventDefault();
    this.isGestionMenuOpen = !this.isGestionMenuOpen;
    const gestionMenu = document.getElementById('gestionMenu');
    if (gestionMenu) {
      gestionMenu.classList.toggle('show');
      gestionMenu.classList.toggle('collapse');
    }
  }

  toggleVentasMenu(event: Event) { // NO MOVER
    event.preventDefault();
    this.isVentasMenuOpen = !this.isVentasMenuOpen;
    const ventasMenu = document.getElementById('ventasMenu');
    if (ventasMenu) {
      ventasMenu.classList.toggle('show');
      ventasMenu.classList.toggle('collapse');
    }
  }

  toggleMovimientosMenu(event: Event) { // NO MOVER
    event.preventDefault();
    this.isMovimientosMenuOpen = !this.isMovimientosMenuOpen;
    const ventasMenu = document.getElementById('ventasMovimiento');
    if (ventasMenu) {
      ventasMenu.classList.toggle('show');
      ventasMenu.classList.toggle('collapse');
    }
  }


  checkActiveRoutes() {
    const currentUrl = this.router.url;
    this.isGestionMenuOpen = currentUrl.includes('/admin/productos') || currentUrl.includes('/admin/marcas');
    this.isVentasMenuOpen = currentUrl.includes('/admin/ventas1') || currentUrl.includes('/admin/ventas2');
    this.isMovimientosMenuOpen = currentUrl.includes('/admin/entrada1') || currentUrl.includes('/admin/salidas2');
  }
  // ----------------------------------------------------------
  
}


// toggleGestionMenu(event: Event) {
//   event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
//   const gestionMenu = document.getElementById('gestionMenu');
//   if (gestionMenu) {
//     gestionMenu.classList.toggle('show'); // Alternar la clase 'show'
//     gestionMenu.classList.toggle('collapse'); // Alternar la clase 'collapse'
//   }
// }

// toggleVentasMenu(event: Event) {
//   event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
//   const ventasMenu = document.getElementById('ventasMenu');
//   if (ventasMenu) {
//     ventasMenu.classList.toggle('show'); // Alternar la clase 'show'
//     ventasMenu.classList.toggle('collapse'); // Alternar la clase 'collapse'
//   }
// }