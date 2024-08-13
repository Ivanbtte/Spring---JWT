import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AutorRequest } from 'src/app/services/registrarusuario/autor';
import { Investigador } from 'src/app/services/registrarusuario/Investigador';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  userForm: FormGroup;
  institutos: any[] = [];
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';

  constructor(private fb: FormBuilder, private registrarusuarioService: RegistrarusuarioService, private router: Router) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],  // Asegúrate de que el control role esté definido aquí
      numeroEmpleado: [''],
      instituto: [''],
      nombre1: [''],
      nombre2: [''],
      apellidoPaterno: [''],
      apellidoMaterno: ['']
    });

    this.userForm.setValidators(this.passwordMatchValidator);
    this.userForm.get('role')?.valueChanges.subscribe((newRole) => {
      console.log('Role changed to:', newRole);
      this.updateAdditionalFields(newRole);
    });
  }
  ngOnInit(): void {
    // Obtener la lista de institutos
    this.registrarusuarioService.getInstitutos().subscribe(
      data => {
        this.institutos = data;
      },
      error => {
        console.error('Error al obtener la lista de institutos', error);
      }
    );
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

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Mostrar errores
      return;
    }
    if (this.userForm.valid) {
      const user = {
        username: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role.toUpperCase()
      };

      this.registrarusuarioService.registro(user).subscribe(
        userResponse => {
          const userId = userResponse.id;
          const userName = userResponse.username;
          const userRole = userResponse.role;
          this.router.navigate(['/usuario']);
          Swal.fire({
            icon: "success",
            title: "¡Registro Exitoso!",
            text: "El usuario ha sido registrado correctamente.",
          });
          if (user.role === 'INVESTIGADOR' || user.role === 'COORDINADOR') {
            const autor: AutorRequest = {
              nombre1Autor: this.userForm.value.nombre1,
              nombre2Autor: this.userForm.value.nombre2,
              apellidoPaternoAutor: this.userForm.value.apellidoPaterno,
              apellidoMaternoAutor: this.userForm.value.apellidoMaterno,
              autorUnsis: true
            };
            if (!this.validarAutor()) {
              return;
            }
            this.registrarusuarioService.registroAutor(autor).subscribe(
              autorResponse => {
                Swal.fire({
                  icon: "success",
                  title: "¡Autor Registrado!",
                  text: "El autor ha sido registrado correctamente.",
                });

                // Obtén el ID del instituto seleccionado
                const institutoId = this.userForm.value.instituto;

                // Encuentra el instituto seleccionado en el array de institutos
                const institutoSeleccionado = this.institutos.find(i => i.id === institutoId);

                const investigador: Investigador = {
                  num_empleado: this.userForm.value.numeroEmpleado,
                  nombre_1_investigador: this.userForm.value.nombre1,
                  nombre_2_investigador: this.userForm.value.nombre2,
                  apellido_paterno_1_investigador: this.userForm.value.apellidoPaterno,
                  apellido_materno_2_investigador: this.userForm.value.apellidoMaterno,
                  user: {
                    id: userId,
                    username: userName,
                    role: userRole,
                    enabled: true,
                  },
                  instituto: {
                    id: institutoId, // ID del instituto seleccionado
                    nombre: institutoSeleccionado ? institutoSeleccionado.nombre : '' // Nombre del instituto seleccionado
                  },
                  autor: {
                    id_autor: autorResponse.id_autor, // ID del autor creado
                    nombre1Autor: autorResponse.nombre1Autor,
                    nombre2Autor: autorResponse.nombre2Autor,
                    apellidoPaternoAutor: autorResponse.apellidoPaternoAutor,
                    apellidoMaternoAutor: autorResponse.apellidoMaternoAutor,
                    autorUnsis: true
                  }
                };
                this.userForm.reset(); // Limpiar el formulario después del registro

                console.log("Registrando....");
                this.registrarusuarioService.registroInvestigador(investigador).subscribe(
                  investigadorResponse => {
                    Swal.fire({
                      icon: "success",
                      title: "¡Investigador Registrado!",
                      text: "El investigador ha sido registrado correctamente.",
                    });
                    this.router.navigate(['/usuario']);
                  },
                  investigadorError => {
                    Swal.fire({
                      icon: "error",
                      title: "Error en Registro de Investigador",
                      text: "Algo salió mal al registrar el investigador.",
                    });
                  }
                );
                this.userForm.reset();
              },
              autorError => {
                Swal.fire({
                  icon: "error",
                  title: "Error en Registro de Autor",
                  text: "Algo salió mal al registrar el autor.",
                });
              }
            );
          }
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

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordToggleIcon = 'fa fa-eye-slash';
    } else {
      this.passwordFieldType = 'password';
      this.passwordToggleIcon = 'fa fa-eye';
    }
  }

  updateAdditionalFields(role: string): void {
    const isAdditionalFieldsRequired = role === 'INVESTIGADOR' || role === 'COORDINADOR';

    if (isAdditionalFieldsRequired) {
      this.userForm.get('instituto')?.setValidators([Validators.required]);
      this.userForm.get('nombre1')?.setValidators([Validators.required]);
      this.userForm.get('apellidoPaterno')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('instituto')?.clearValidators();
      this.userForm.get('nombre1')?.clearValidators();
      this.userForm.get('apellidoPaterno')?.clearValidators();
    }

    this.userForm.get('instituto')?.updateValueAndValidity();
    this.userForm.get('nombre1')?.updateValueAndValidity();
    this.userForm.get('apellidoPaterno')?.updateValueAndValidity();
    // Limpiar los campos si el rol cambia
    if (!isAdditionalFieldsRequired) {
      this.userForm.patchValue({
        numeroEmpleado: '',
        instituto: '',
        nombre1: '',
        apellidoPaterno: '',
        nombre2: '',
        apellidoMaterno: ''
      });
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
  convertEmailToLowerCase(): void {
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      const emailValue = emailControl.value;
      emailControl.setValue(emailValue.toLowerCase(), { emitEvent: false });
    }
  }

  validarAutor(): boolean {
    const nombre1 = this.userForm.get('nombre1')?.value;
    const apellidoPaterno = this.userForm.get('apellidoPaterno')?.value;
    const selectedInstituto = this.userForm.get('instituto')?.value;
    console.log("Validado");
    if (!nombre1 || !apellidoPaterno || !selectedInstituto) {
      this.userForm.markAllAsTouched();  // Muestra los mensajes de error en caso de que falte algún dato.
      return false;
    }

    return true;
  }

  onInput(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    let valor = inputElement.value;

    // Elimina caracteres no permitidos
    valor = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ'´]/g, '');

    // Convertir a mayúscula la primera letra y el resto a minúsculas
    valor = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();

    // Asigna el valor limpio de nuevo al campo de entrada
    inputElement.value = valor;

    // Actualiza el modelo de formulario reactivo
    if (this.userForm.contains(field)) {
      this.userForm.get(field)?.setValue(valor);
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

  /* report(){
     this.registrarusuarioService.reporte().subscribe(response => {
       const blob = new Blob([response], { type: 'application/pdf' });
       const url = window.URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.href = url;
       link.download = 'reporte.pdf';
       link.click();
       window.URL.revokeObjectURL(url);
     }, error => {
       console.error('Error downloading the file', error);
     });
   }
 
   reportExel() {
     this.registrarusuarioService.reporteExe().subscribe(response => {
       const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       const url = window.URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.href = url;
       link.download = 'reporte.xlsx';
       link.click();
       window.URL.revokeObjectURL(url);
     }, error => {
       console.error('Error downloading the file', error);
     });
   }*/

}


