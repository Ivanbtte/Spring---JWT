import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorRequest } from 'src/app/services/registrarusuario/autor';
import { Investigador } from 'src/app/services/registrarusuario/Investigador';
import { RegistrarusuarioService } from 'src/app/services/registrarusuario/registrarusuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  userForm: FormGroup;
  institutos: any[] = [];
  investigadorId: number | null = null;
  userId: number | null = null;
  passwordFieldType: string = 'password';
  passwordToggleIcon: string = 'fa fa-eye';
  autorunsis: boolean = false;
  autorId: any;
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
        console.log("Institutos: ", data);
      },
      error => {
        console.error('Error al obtener la lista de institutos', error);
      }
    );

    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.loadUserData(this.userId);
    }
  }

  loadUserData(userId: number): void {
    this.registrarusuarioService.getUserById(userId).subscribe(
      user => {
        console.log('Datos del usuario:', user);

        this.userId = user.id; 
        this.username = user.username;
        this.userstatus = user.enabled;
        
        if (this.userId) {
          this.registrarusuarioService.getInvestigadorById(this.userId).subscribe(
            investigador => {
              console.log('Datos del investigador:', investigador);

              this.investigadorId = investigador.id;
              this.autorunsis = investigador.autor.autorUnsis;
              this.autorId = investigador.autor.id_autor;

              this.userForm.patchValue({
                id: this.userId,
                role: user.role || '',
                instituto: investigador.instituto?.id || '',
                nombre1: investigador.nombre_1_investigador || '',
                nombre2: investigador.nombre_2_investigador || '',
                apellidoPaterno: investigador.apellido_paterno_1_investigador || '',
                apellidoMaterno: investigador.apellido_materno_2_investigador || ''
              });

              console.log('Valores del formulario después de patchValue:', this.userForm.value);

              this.updateAdditionalFields(user.role);
            },
            error => {
              console.error('Error loading investigator data:', error);
            }
          );
        } else {
          // Maneja el caso en el que no hay ID del investigador
          this.userForm.patchValue({
            email: user.username || '',
            role: user.role || ''
            // Otros campos que no dependen del investigador
          });
          this.updateAdditionalFields(user.role);
        }
      },
      error => {
        console.error('Error loading user data:', error);
      }
    );
  }

  onSubmit() {
    console.log('Botón de enviar presionado');
    console.log('Formulario Válido:', this.userForm.valid); // Verifica la validez del formulario

    // Log de validez para cada control
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      console.log(`${key} Válido:`, control?.valid, 'Errores:', control?.errors);
    });
    console.log('Formulario Válido:', this.userForm.valid); // Verifica la validez del formulario

    if (this.userForm.valid) {
      const user = {
        id: this.userForm.value.id,
        role: this.userForm.value.role.toUpperCase() // Solo se necesita el rol
      };

      // Aquí se imprime el objeto `user` antes de enviarlo al backend
      console.log('Datos del Usuario al actualizar:', user);

      // Editar usuario existente
      this.registrarusuarioService.updateUser(this.userId!, user).subscribe(
        userResponse => {
          console.log('Respuesta del Usuario:', userResponse);
          const userId = userResponse.id;
          const userRole = userResponse.role;

          Swal.fire({
            icon: "success",
            title: "¡Actualización Exitosa!",
            text: "El usuario ha sido actualizado correctamente.",
          });

          if (user.role === 'INVESTIGADOR' || user.role === 'COORDINADOR') {
            const autor: AutorRequest = {
              nombre1Autor: this.userForm.value.nombre1,
              nombre2Autor: this.userForm.value.nombre2,
              apellidoPaternoAutor: this.userForm.value.apellidoPaterno,
              apellidoMaternoAutor: this.userForm.value.apellidoMaterno,
              autorUnsis:  this.autorunsis
            };

            // Imprimir los datos que se enviarán al servicio de `autor`
            console.log('Datos del Autor al actualizar:', autor);

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

            // Imprimir los datos que se enviarán al servicio de `investigador`
            console.log('Datos del Investigador al actualizar:', investigador);

            this.registrarusuarioService.updateAutor(this.investigadorId!, autor).subscribe(
              autorResponse => {
                Swal.fire({
                  icon: "success",
                  title: "¡Autor Actualizado!",
                  text: "El autor ha sido actualizado correctamente.",
                });

                this.registrarusuarioService.updateInvestigador(this.investigadorId!, investigador).subscribe(
                  investigadorResponse => {
                    Swal.fire({
                      icon: "success",
                      title: "¡Investigador Actualizado!",
                      text: "El investigador ha sido actualizado correctamente.",
                    });
                  },
                  investigadorError => {
                    console.log('Error en la actualización de Investigador:', investigadorError); // Log del error
                    Swal.fire({
                      icon: "error",
                      title: "Error en Actualización de Investigador",
                      text: "Algo salió mal al actualizar el investigador.",
                    });
                  }
                );
              },
              autorError => {
                console.log('Error en la actualización de Autor:', autorError); // Log del error
                Swal.fire({
                  icon: "error",
                  title: "Error en Actualización de Autor",
                  text: "Algo salió mal al actualizar el autor.",
                });
              }
            );
          }
        },
        error => {
          console.log('Error al actualizar el usuario:', error); // Aquí se imprime el error de la solicitud
          console.log('Datos del Usuario fallido al actualizar:', user); // Aquí se re-imprime el objeto `user`
          Swal.fire({
            icon: "error",
            title: "Error al actualizar el usuario",
            text: "Algo salió mal!",
          });
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
      this.userForm.get('apellidoMaterno')?.setValidators([Validators.required]);
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

}
