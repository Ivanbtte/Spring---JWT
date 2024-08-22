import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorRequest } from 'src/app/services/registrarusuario/autor';
import { Investigador } from 'src/app/services/registrarusuario/Investigador';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-investigador.component.html',
  styleUrls: ['./editar-investigador.component.css']
})
export class EditarInvestigadorComponent implements OnInit {
  userForm: FormGroup;
  institutos: any[] = [];
  investigadorId: number | null = null;
  userId: number | null = null;
  autorunsis: boolean = false;
  autorId: any;
  username: string = 'username';
  userstatus: boolean = false;
  datosCargados: boolean = false; // variable de control

  constructor(
    private fb: FormBuilder,
    private registrarusuarioService: RegistrarusuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: [''],
      role: ['', Validators.required],
      instituto: [''],
      nombre1: [''],
      nombre2: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
    });
  }

  ngOnInit(): void {
    // Obtener la lista de institutos
    this.registrarusuarioService.getInstitutos().subscribe(
      data => {
        this.institutos = data;
        // Solo carga los datos del investigador después de que los institutos se hayan cargado
        this.userId = this.route.snapshot.params['id'];
        if (this.userId) {
          this.loadInvestData(this.userId);
        }
      },
      error => {
        console.error('Error al obtener la lista de institutos', error);
      }
    );
  }

  loadInvestData(userId: number): void {
    this.registrarusuarioService.getInvestigadorById(userId).subscribe(
      invest => {
        this.userId = invest.user.id;
        this.username = invest.user.username;
        this.userstatus = invest.user.enabled;
        if (this.userId) {
          this.registrarusuarioService.getAutorByIds(this.userId).subscribe(
            investigador => {
              this.investigadorId = investigador.id;
              this.autorunsis = investigador.autor.autorUnsis;
              this.autorId = investigador.autor.id_autor;
              this.userForm.patchValue({
                id: this.userId,
                role: invest.user.role || '',
                instituto: investigador.instituto?.id || '',
                nombre1: investigador.nombre_1_investigador || '',
                nombre2: investigador.nombre_2_investigador || '',
                apellidoPaterno: investigador.apellido_paterno_1_investigador || '',
                apellidoMaterno: investigador.apellido_materno_2_investigador || ''
              });
              this.userForm.updateValueAndValidity();
              this.updateAdditionalFields(invest.user.role);
              this.datosCargados = true;
            },
            error => {
              console.error('Error loading investigator data:', error);
            }
          );
        } else {
          // Maneja el caso en el que no hay ID del investigador
          this.userForm.patchValue({
            email: invest.user.username || '',
            role: invest.user.role || ''
          });
          this.updateAdditionalFields(invest.user.role);
          this.datosCargados = true;
        }
      },
      error => {
        console.error('Error loading user data:', error);
      }
    );
  }

  onSubmit() {
    // Log de validez para cada control
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
    });
    if (this.userForm.valid) {
      const user = {
        id: this.userForm.value.id,
        role: this.userForm.value.role.toUpperCase() // Solo se necesita el rol
      };
      // Editar usuario existente
      this.registrarusuarioService.updateUser(this.userId!, user).subscribe(
        userResponse => {
          const userId = userResponse.id;
          const userRole = userResponse.role;
          if (user.role === 'INVESTIGADOR' || user.role === 'COORDINADOR') {
            const autor: AutorRequest = {
              nombre1Autor: this.userForm.value.nombre1,
              nombre2Autor: this.userForm.value.nombre2,
              apellidoPaternoAutor: this.userForm.value.apellidoPaterno,
              apellidoMaternoAutor: this.userForm.value.apellidoMaterno,
              autorUnsis: this.autorunsis
            };
            const institutoId = this.userForm.value.instituto;
            const institutoSeleccionado = this.institutos.find(i => i.id === institutoId);
            const investigador: Investigador = {
              num_empleado: this.userForm.value.numeroEmpleado,
              nombre_1_investigador: this.userForm.value.nombre1,
              nombre_2_investigador: this.userForm.value.nombre2,
              apellido_paterno_1_investigador: this.userForm.value.apellidoPaterno,
              apellido_materno_2_investigador: this.userForm.value.apellidoMaterno,
              user: {
                id: user.id,
                username: this.username,
                role: user.role,
                enabled: true,
              },
              instituto: {
                id: institutoId, // ID del instituto seleccionado
                nombre: institutoSeleccionado ? institutoSeleccionado.nombre : '' // Nombre del instituto seleccionado
              },
              autor: {
                id_autor: this.autorId, // ID del autor actualizado
                nombre1Autor: autor.nombre1Autor,
                nombre2Autor: autor.nombre2Autor,
                apellidoPaternoAutor: autor.apellidoPaternoAutor,
                apellidoMaternoAutor: autor.apellidoMaternoAutor,
                autorUnsis: this.autorunsis
              }
            };
            this.registrarusuarioService.updateAutor(this.investigadorId!, autor).subscribe(
              autorResponse => {
                this.registrarusuarioService.updateInvestigador(this.investigadorId!, investigador).subscribe(
                  investigadorResponse => {
                    Swal.fire({
                      icon: "success",
                      title: "!Actualizado!",
                      text: "Ha sido actualizado correctamente.",
                    });

                    // Redirigir al usuario a otra dirección después de la actualización exitosa
                    this.router.navigate(['/investigador']);
                  },
                  investigadorError => {
                    Swal.fire({
                      icon: "error",
                      title: "Error en Actualización",
                      text: "Algo salió mal al actualizar",
                    });
                  }
                );
              },
              autorError => {
              }
            );
          } else {
            // Redirigir al usuario a otra dirección después de la actualización exitosa
            this.router.navigate(['/investigador']);
          }
        },
        error => {
        }
      );
    }
  }


  updateAdditionalFields(role: string): void {
    const isAdditionalFieldsRequired = role === 'INVESTIGADOR' || role === 'COORDINADOR';

    // Ajusta validadores según el rol
    if (isAdditionalFieldsRequired) {
      this.userForm.get('instituto')?.setValidators([Validators.required]);
      this.userForm.get('nombre1')?.setValidators([Validators.required]);
      this.userForm.get('apellidoPaterno')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('instituto')?.clearValidators();
      this.userForm.get('nombre1')?.clearValidators();
      this.userForm.get('apellidoPaterno')?.clearValidators();
      this.userForm.get('apellidoMaterno')?.clearValidators();
    }

    // Actualiza el estado de validación del formulario
    this.userForm.get('instituto')?.updateValueAndValidity();
    this.userForm.get('nombre1')?.updateValueAndValidity();
    this.userForm.get('nombre2')?.updateValueAndValidity();
    this.userForm.get('apellidoPaterno')?.updateValueAndValidity();
    this.userForm.get('apellidoMaterno')?.updateValueAndValidity();

  }
  cancel(): void {
    this.router.navigate(['/investigador']);
  }
  onKeyPress(event: KeyboardEvent, field: string): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'´]$/.test(char)) {
      // Prevenir la entrada del carácter no permitido.
      event.preventDefault();
    }
  }

  onInput(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    let valor = inputElement.value;
    valor = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ'´]/g, '');
    valor = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
    inputElement.value = valor;
    (this as any)[field] = valor;  // Aquí está el cambio para evitar el error
  }

}
