import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { InvestigadorService } from 'src/app/services/investigador/investigador.service';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  selectedOption: string | null = null;
  trimestres: any[] = [];
  institutos: any[] = [];
  tiposPublicacion: any[] = [];
  fileSelected: File | null = null;
  isUploadButtonEnabled: boolean = false;  // Variable para habilitar/deshabilitar el botón

  constructor(private catalogoService: CatalogoService,  private router: Router, private investigadorService: InvestigadorService) { }

  ngOnInit(): void {
    this.loadTrimestres();
    this.loadInstitutos();
    this.loadTiposPublicacion();
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  loadTrimestres(): void {
    this.catalogoService.getTrimestres().subscribe(
      (data: any[]) => {
        this.trimestres = data;
      },
      (error: any) => {
        console.error('Error al obtener los trimestres:', error);
      }
    );
  }

  loadInstitutos(): void {
    this.catalogoService.getInstitutos().subscribe(
      (data: any[]) => {
        this.institutos = data;
      },
      (error: any) => {
        console.error('Error al obtener los institutos:', error);
      }
    );
  }

  loadTiposPublicacion(): void {
    this.catalogoService.getTiposPublicacion().subscribe(
      (data: any[]) => {
        this.tiposPublicacion = data;
      },
      (error: any) => {
        console.error('Error al obtener los tipos de publicación:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected = file;
      this.isUploadButtonEnabled = true;  // Habilita el botón cuando se selecciona un archivo
    } else {
      this.fileSelected = null;
      this.isUploadButtonEnabled = false;  // Deshabilita el botón si no hay archivo
    }
  }

  uploadFile(file: File): void {
    this.catalogoService.uploadFile(file).subscribe(
      (response: any) => {
        console.log('Archivo cargado exitosamente:', response);
      },
      (error: any) => {
        console.error('Error al cargar el archivo:', error);
      }
    );
  }

  onSubmit(): void {
   // Redirige al componente de registro con el parámetro adecuado
  switch (this.selectedOption) {
    case 'trimestre':
      this.router.navigate(['/registrar-catalogo'], { queryParams: { form: 'trimestre' } });
      break;
    case 'instituto':
      this.router.navigate(['/registrar-catalogo'], { queryParams: { form: 'instituto' } });
      break;
    case 'tipo-publicacion':
      this.router.navigate(['/registrar-catalogo'], { queryParams: { form: 'tipo-publicacion' } });
      break;
    default:
      break;
    }
  }

  editarTrimestre(trimestre: any): void {
    // Implementar lógica de edición de trimestre
  }

  eliminarTrimestre(trimestre: any): void {
    // Implementar lógica de eliminación de trimestre
  }

  editarInstituto(instituto: any): void {
    // Implementar lógica de edición de instituto
  }

  eliminarInstituto(instituto: any): void {
    // Implementar lógica de eliminación de instituto
  }

  editarTipoPublicacion(tipoPublicacion: any): void {
    // Implementar lógica de edición de tipo de publicación
  }

  eliminarTipoPublicacion(tipoPublicacion: any): void {
    // Implementar lógica de eliminación de tipo de publicación
  }

  cargarInvestigadores() {
    if (this.fileSelected) {
      this.investigadorService.cargarInvestigadoresDesdeExcel(this.fileSelected).subscribe(
        response => {
          console.log('Archivo cargado exitosamente');
          // Aquí puedes manejar la respuesta del backend
        },
        error => {
          console.error('Error al cargar el archivo', error);
        }
      );
    }
  }
  
  descargarFormatoExcel() {
    this.investigadorService.descargarFormato();
  }
}