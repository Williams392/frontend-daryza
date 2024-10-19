import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/models/User';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = new User();
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('last_name', this.user.last_name);
    formData.append('email', this.user.email);
    formData.append('phone_number', this.user.phone_number);
    formData.append('password', this.user.password);

    this.authService.signup(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Error al registrar el usuario';
      }
    });
  }
}
