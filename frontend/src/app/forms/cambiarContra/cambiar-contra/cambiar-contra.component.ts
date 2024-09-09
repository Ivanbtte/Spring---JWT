import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.css']
})
export class CambiarContraComponent implements OnInit {
  passwordForm: FormGroup;
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';
  userId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private registrarusuarioService: RegistrarusuarioService,
    private router: Router,
    private loginService: LoginService,) { 
      this.passwordForm = this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          this.passwordValidator
        ]],
        confirmPassword: ['', [Validators.required]]
      });
      this.passwordForm.setValidators(this.passwordMatchValidator);
    }

  ngOnInit(): void {
   // Suscribirse al BehaviorSubject del ID del usuario
   this.loginService.getUserId().subscribe((id: number | null) => {
    this.userId = id; // Almacenar el ID del usuario
    console.log('User ID in CambiarContraComponent:', this.userId); // Verifica que se está obteniendo correctamente
  });
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
  
    if (this.passwordForm.valid && this.userId !== null) {
      const newPassword = this.passwordForm.value.password;
  
      // Obtener el usuario por ID
      this.registrarusuarioService.getUserById(this.userId).subscribe(
        (user) => {
          // Actualizar solo el campo de contraseña
          user.password = newPassword;
  
          this.registrarusuarioService.updateUserPass(this.userId!, user).subscribe(
            () => {
              Swal.fire({
                icon: "success",
                title: "¡Contraseña actualizada!",
                text: "Su contraseña ha sido cambiada correctamente.",
              });
              this.router.navigate(['/mis-publicaciones']);
            },
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo salió mal al cambiar la contraseña.",
              });
            }
          );
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener la información del usuario.",
          });
        }
      );
    }
  }
  

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (!/[A-Z]/.test(value)) {
      return { uppercase: true };
    }
    if (!/[0-9]/.test(value)) {
      return { number: true };
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return { special: true };
    }
    return null;
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { mismatch: true };
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

  cancel(): void {
    this.router.navigate(['/mis-publicaciones']);
  }
}
