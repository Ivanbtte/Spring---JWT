import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  userForm: FormGroup;
  userId: number = 0;
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';
  username: string = 'username';
  userstatus: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private registrarusuarioService: RegistrarusuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: [''],
      role: ['', Validators.required],
      username: [''],
      password: ['', [
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.loadUserData(this.userId);
    }
  }

  loadUserData(userId: number): void {
    this.registrarusuarioService.getUserById(userId).subscribe(
      user => {
        this.userId = user.id;
        this.username = user.username;
        this.userstatus = user.enabled;
        this.isAdmin = user.role === 'ADMIN' || user.role === 'ROOT'; 
        this.userForm.patchValue({
          id: this.userId,
          role: user.role || '',
          username: user.username || ''
        });
      },
      error => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.registrarusuarioService.getUserById(this.userId).subscribe(
      currentUserData => {
        const updatedUser = {
          id: this.userId,
          username: this.userForm.value.username || currentUserData.username,
          password: this.userForm.value.password ? this.userForm.value.password : currentUserData.password, // Actualizar solo si se cambia la contraseña
          role: this.userForm.value.role ? this.userForm.value.role.toUpperCase() : currentUserData.role,
        };

        this.registrarusuarioService.updateUserPass(this.userId, updatedUser).subscribe(
          userResponse => {
            this.router.navigate(['/usuario']);
            Swal.fire({
              icon: "success",
              title: "¡Exitoso!",
              text: "El usuario ha sido editado correctamente.",
            });
          },
          error => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salió mal!",
            });
          }
        );
      },
      error => {
        Swal.fire({
          icon: "error",
          title: "Error al obtener los datos del usuario",
          text: "No se pudieron cargar los datos actuales del usuario.",
        });
      }
    );
  }

  // Validación personalizada para la contraseña: solo aplicarla si se ingresa un valor
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

  // Validación para asegurarse de que las contraseñas coincidan, pero solo si se ingresan
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (!password && !confirmPassword) {
      return null; // Si ambos están vacíos, no hay error
    }
    return password === confirmPassword ? null : { mismatch: true };
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
    this.router.navigate(['/usuario']);
  }
}
