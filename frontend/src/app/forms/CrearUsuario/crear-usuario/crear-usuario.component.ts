import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  userForm: FormGroup;
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';
  
  constructor(private fb: FormBuilder, private registrarusuarioService: RegistrarusuarioService) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]  // Asegúrate de que el control role esté definido aquí
    });

    this.userForm.setValidators(this.passwordMatchValidator);
  }
  ngOnInit(): void {
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
    if (this.userForm.valid) {
      const user = {
        username: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role.toUpperCase() // Asegúrate de que el rol esté en mayúsculas
      };

      this.registrarusuarioService.registro(user).subscribe(
        response => {
          Swal.fire({
            icon: "success",
            title: "¡Registro Exitoso!",
            text: "El usuario ha sido registrado correctamente.",
          });
          this.userForm.reset(); // Limpiar el formulario después del registro
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


