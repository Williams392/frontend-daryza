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
            if (response.token && response.role) {
                this.authService.setToken(response.token, response.role);
                this.router.navigate(['/admin/dashboard']);
            } else {
                this.errorMessage = 'Token o rol no recibido';
            }
        },
        error: (error) => {
            // Manejo del error
            if (error.status === 401) {
                // Si la respuesta es 401, muestra el mensaje correspondiente
                this.errorMessage = error.error.msg || 'Credenciales inválidas';
            } else {
                // Manejo de otros errores
                this.errorMessage = 'Ocurrió un error. Por favor, intenta nuevamente.';
            }
            console.error(error);
        }
    });
  }

}

