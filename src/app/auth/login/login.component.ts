import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  hasValidationErrors(): boolean {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
    return (emailControl?.invalid ?? false) && ((emailControl?.dirty ?? false) || (emailControl?.touched ?? false)) ||
           (passwordControl?.invalid ?? false) && ((passwordControl?.dirty ?? false) || (passwordControl?.touched ?? false));
  }
  
  onLogin(): void {
    if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe({
            next: (response) => {
                if (response.token && response.role && response.username) {
                    // Aquí se añade el username al guardar
                    this.authService.setToken(response.token, response.role, response.username);
                    this.router.navigate(['/admin/dashboard/']);
                } else {
                    this.errorMessage = 'Token, rol o username no recibido';
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
