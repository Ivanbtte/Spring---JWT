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
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    });
    this.userForm.setValidators(this.passwordMatchValidator);
    this.userForm.get('role')?.valueChanges.subscribe((newRole) => {
    });
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

        this.userForm.patchValue({
          id: this.userId,
          role: user.role || '',
          username: user.username || ''
          // La contraseña no se carga para evitar exposición accidental
        });
      },
      error => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }



  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Mostrar errores
      return;
    }

    if (this.userForm.valid) {
      const user = {
        id: this.userId,
        username: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role.toUpperCase(),
      };
      this.registrarusuarioService.updateUserPass(this.userId, user).subscribe(
        userResponse => {
          // Redirigir al usuario a la página de usuarios
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

  convertEmailToLowerCase(): void {
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      const emailValue = emailControl.value;
      emailControl.setValue(emailValue.toLowerCase(), { emitEvent: false });
    }
  }

  onKeyPress(event: KeyboardEvent, field: string): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'´]$/.test(char)) {
      // Prevenir la entrada del carácter no permitido.
      event.preventDefault();
    }
  }

  onKeyPressNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);

    // Verifica si el carácter es un número (0-9)
    if (!/^\d$/.test(char)) {
      // Prevenir la entrada de caracteres no permitidos
      event.preventDefault();
    }
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

  updateEmailFieldState(role: string): void {
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      if (role === 'COORDINADOR' || role === 'INVESTIGADOR') {
        emailControl.disable(); // Desactiva el campo si el rol es COORDINADOR o INVESTIGADOR
      } else if (role === 'ADMIN' || role === 'ROOT') {
        emailControl.enable(); // Habilita el campo si el rol es ADMIN o ROOT
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/usuario']);
  }
}
