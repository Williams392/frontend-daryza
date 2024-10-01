import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(response); // Verifica que la respuesta contenga el token
        if (response.token) {
          this.authService.setToken(response.token); // Guarda el token
          this.router.navigate(['/admin/dashboard']); // Redirige al dashboard
        } else {
          this.errorMessage = 'Token no recibido';
        }
      },
      error: (error) => {
        this.errorMessage = 'Credenciales inválidas';
        console.error(error);
      }
    });
  }
  

}
