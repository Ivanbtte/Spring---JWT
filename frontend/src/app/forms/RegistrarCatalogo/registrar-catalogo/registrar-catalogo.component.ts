import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registrar-catalogo',
  templateUrl: './registrar-catalogo.component.html',
  styleUrls: ['./registrar-catalogo.component.css']
})
export class RegistrarCatalogoComponent implements OnInit {
  selectedForm: string | null = null;
  trimestreForm: FormGroup;
  institutoForm: FormGroup;
  tipoPublicacionForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogoService: CatalogoService,
    private fb: FormBuilder
  ) {
    this.trimestreForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required]
    });

    this.institutoForm = this.fb.group({
      nombre: ['', Validators.required]
    });

    this.tipoPublicacionForm = this.fb.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedForm = params['form'] || null;
    });
  }

  selectForm(form: string): void {
    this.selectedForm = form;
  }

  onSubmit() {
    if (this.selectedForm === 'trimestre') {
      this.registrarTrimestre();
    } else if (this.selectedForm === 'instituto') {
      this.registrarInstituto();
    } else if (this.selectedForm === 'tipo-publicacion') {
      this.registrarTipoPublicacion();
    }
  }

  registrarTrimestre() {
    if (this.trimestreForm.valid) {
      const trimestre = {
        nombre: this.trimestreForm.value.nombre,
        fecha_inicio: this.trimestreForm.value.fecha_inicio,
        fecha_fin: this.trimestreForm.value.fecha_fin
      };

      this.catalogoService.addTrimestre(trimestre).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'El trimestre ha sido registrado correctamente.',
          });
          this.router.navigate(['/catalogo']);
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal: ' + error.error.message,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor, complete todos los campos del formulario de trimestre.',
      });
    }
  }

  registrarInstituto() {
    if (this.institutoForm.valid) {
      const instituto = {
        nombre: this.institutoForm.value.nombre
      };

      this.catalogoService.addInstituto(instituto).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'El instituto ha sido registrado correctamente.',
          });
          this.router.navigate(['/catalogo']);
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal: ' + error.error.message,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor, complete todos los campos del formulario de instituto.',
      });
    }
  }

  registrarTipoPublicacion() {
    if (this.tipoPublicacionForm.valid) {
      const tipoPublicacion = {
        descripcion_publicacion_tipo: this.tipoPublicacionForm.value.descripcion
      };

      this.catalogoService.addTipoPublicacion(tipoPublicacion).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'El tipo de publicación ha sido registrado correctamente.',
          });
          this.router.navigate(['/catalogo']);
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal: ' + error.error.message,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor, complete todos los campos del formulario de tipo de publicación.',
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/catalogo']);
  }
}