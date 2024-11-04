import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta si es necesario

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Obtiene el token del AuthService
    
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`, // Agrega el token en el encabezado
        },
      });
      return next.handle(clonedRequest); // Maneja la solicitud clonada
    }

    return next.handle(req); // Si no hay token, maneja la solicitud original
  }
}