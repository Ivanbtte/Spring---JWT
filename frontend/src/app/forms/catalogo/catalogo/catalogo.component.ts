import { Component, OnInit } from '@angular/core';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';

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

  constructor(private catalogoService: CatalogoService) { }

  ngOnInit(): void {
    this.loadTrimestres();
    this.loadInstitutos();
    this.loadTiposPublicacion();
  }

  selectOption(option: string) {
    this.selectedOption = option;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
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
    switch (this.selectedOption) {
      case 'trimestre':
        const nuevoTrimestre = {
          // Definir los campos necesarios para el trimestre
        };
        this.registrarTrimestre(nuevoTrimestre);
        break;
      case 'instituto':
        const nuevoInstituto = {
          // Definir los campos necesarios para el instituto
        };
        this.registrarInstituto(nuevoInstituto);
        break;
      case 'tipo-publicacion':
        const nuevoTipoPublicacion = {
          // Definir los campos necesarios para el tipo de publicación
        };
        this.registrarTipoPublicacion(nuevoTipoPublicacion);
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

  registrarTrimestre(trimestre: any): void {
    this.catalogoService.addTrimestre(trimestre).subscribe(
      (response: any) => {
        console.log('Trimestre registrado exitosamente:', response);
        this.loadTrimestres();
      },
      (error: any) => {
        console.error('Error al registrar el trimestre:', error);
      }
    );
  }

  registrarInstituto(instituto: any): void {
    this.catalogoService.addInstituto(instituto).subscribe(
      (response: any) => {
        console.log('Instituto registrado exitosamente:', response);
        this.loadInstitutos();
      },
      (error: any) => {
        console.error('Error al registrar el instituto:', error);
      }
    );
  }

  registrarTipoPublicacion(tipoPublicacion: any): void {
    this.catalogoService.addTipoPublicacion(tipoPublicacion).subscribe(
      (response: any) => {
        console.log('Tipo de publicación registrado exitosamente:', response);
        this.loadTiposPublicacion();
      },
      (error: any) => {
        console.error('Error al registrar el tipo de publicación:', error);
      }
    );
  }
}