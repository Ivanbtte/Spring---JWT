import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userRole!: string;
  userId!: number | null;
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';
  loginError: string = "";
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.controls.username;
  }


  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordToggleIcon = 'fa fa-eye-slash';
    } else {
      this.passwordFieldType = 'password';
      this.passwordToggleIcon = 'fa fa-eye';
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.loginError = "";
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          this.userRole = this.loginService.getUserRole();
          if (this.userRole === 'ADMIN' || this.userRole === 'ROOT' || this.userRole === 'COORDINADOR') {
            this.router.navigateByUrl('/consultar-publicacion');
          } else if (this.userRole === 'INVESTIGADOR') {
            this.router.navigateByUrl('/mis-publicaciones');
          } else {
            this.router.navigateByUrl('/inicio'); // Ruta predeterminada si el rol no coincide
          }

          this.loginForm.reset();
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = errorData;
        },
        complete: () => {
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
}
