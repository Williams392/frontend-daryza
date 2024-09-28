import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  isCollapsed = false;
  isGestionMenuOpen = false;
  isVentasMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkActiveRoutes();
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  inicioPAGINA() {
    this.router.navigate(['cliente/Inicio']);
  }

  toggleGestionMenu(event: Event) {
    event.preventDefault();
    this.isGestionMenuOpen = !this.isGestionMenuOpen;
    const gestionMenu = document.getElementById('gestionMenu');
    if (gestionMenu) {
      gestionMenu.classList.toggle('show');
      gestionMenu.classList.toggle('collapse');
    }
  }

  toggleVentasMenu(event: Event) {
    event.preventDefault();
    this.isVentasMenuOpen = !this.isVentasMenuOpen;
    const ventasMenu = document.getElementById('ventasMenu');
    if (ventasMenu) {
      ventasMenu.classList.toggle('show');
      ventasMenu.classList.toggle('collapse');
    }
  }

  checkActiveRoutes() {
    const currentUrl = this.router.url;
    this.isGestionMenuOpen = currentUrl.includes('/admin/productos') || currentUrl.includes('/admin/marcas');
    this.isVentasMenuOpen = currentUrl.includes('/admin/ventas1') || currentUrl.includes('/admin/ventas2');
  }
  
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