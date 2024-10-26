import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMessage: string = ''; // Declarar e inicializar errorMessage
  
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  
    ngOnInit(): void {}
  
    onLogin(): void {
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe({
          next: (response) => {
            if (response.token && response.role) {
              this.authService.setToken(response.token, response.role);
              this.router.navigate(['/admin/dashboard/']);
            } else {
              this.errorMessage = 'Token o rol no recibido';
            }
          },
          error: (error) => {
            if (error.status === 401) {
              this.errorMessage = error.error.msg || 'Credenciales inválidas';
            } else {
              this.errorMessage = 'Ocurrió un error. Por favor, intenta nuevamente.';
            }
            console.error(error);
          }
        });
      }
    }
  }

