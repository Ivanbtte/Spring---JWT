import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-catalogo',
  templateUrl: './registrar-catalogo.component.html',
  styleUrls: ['./registrar-catalogo.component.css']
})
export class RegistrarCatalogoComponent implements OnInit {
  selectedForm: string | null = null;

  constructor(private route: ActivatedRoute,  private router: Router ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedForm = params['form'] || null;
    });
  }

  selectForm(form: string): void {
    this.selectedForm = form;
  }

  // Modelos para los formularios
  nuevoTrimestre = {
    nombre: '',
    fecha_inicio: '',
    fecha_fin: ''
  };

  nuevoInstituto = {
    nombre: ''
  };

  nuevoTipoPublicacion = {
    descripcion: ''
  };

  // Métodos de manejo de formularios
  onSubmit() {
    // Lógica para manejar el envío del formulario
    console.log('Formulario enviado');
  }

  // Métodos para seleccionar formularios
  selectOption(option: string) {
    this.selectedForm = option;
  }

  // Métodos para manejar acciones en los formularios
  editarTrimestre(trimestre: any) {
    // Lógica para editar un trimestre
  }

  eliminarTrimestre(trimestre: any) {
    // Lógica para eliminar un trimestre
  }

  editarInstituto(instituto: any) {
    // Lógica para editar un instituto
  }

  eliminarInstituto(instituto: any) {
    // Lógica para eliminar un instituto
  }

  editarTipoPublicacion(tipoPublicacion: any) {
    // Lógica para editar un tipo de publicación
  }

  eliminarTipoPublicacion(tipoPublicacion: any) {
    // Lógica para eliminar un tipo de publicación
  }
    // Método para regresar
    goBack(): void {
      this.router.navigate(['/catalogo']); // Cambia '/anterior' por la ruta a la que deseas regresar
    }
}