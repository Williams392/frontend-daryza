import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/login/';
  private signupUrl = 'http://localhost:8000/api/auth/signup/';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password });
  }

  signup(user: FormData): Observable<any> {
    return this.http.post(this.signupUrl, user);
  }  

  setToken(token: string, role: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Guardar el rol del usuario
    localStorage.setItem('username', username); // Guardar el username
    console.log('Token, rol y username guardados:', token, role, username);
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role'); // Obtener el rol guardado
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Limpiar el rol
    this.router.navigate(['/login']);
  }
  
}
