import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/api/auth/login/';  // URL de tu backend para login
  
    constructor(private http: HttpClient, private router: Router) { }
  
    login(email: string, password: string): Observable<any> {
      return this.http.post(this.apiUrl, { email, password });
    }
  
    setToken(token: string): void {
        localStorage.setItem('token', token); // Guarda el token en el almacenamiento local
        console.log('Token guardado:', token); // Verifica que el token se está guardando
      }
      
  
    getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    isAuthenticated(): boolean {
      return !!this.getToken();  // Devuelve true si hay un token, indicando que el usuario está autenticado
    }
  
    logout(): void {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);  // Redirige a la página de login tras cerrar sesión
    }

  }
