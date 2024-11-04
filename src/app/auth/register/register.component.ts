import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/User';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onRegister(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.registerForm.value.username);
      formData.append('last_name', this.registerForm.value.last_name);
      formData.append('email', this.registerForm.value.email);
      formData.append('phone_number', this.registerForm.value.phone_number);
      formData.append('password', this.registerForm.value.password);

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
}