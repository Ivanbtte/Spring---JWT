import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { AutorService } from 'src/app/services/autor/autor.service';
import { InstitutoService } from 'src/app/services/instituto/instituto.service';
@Component({
  selector: 'app-consultar-publicacion',
  templateUrl: './consultar-publicacion.component.html',
  styleUrls: ['./consultar-publicacion.component.css']
})
export class ConsultarPublicacionComponent implements OnInit {
  filtrarPorInstituto: boolean = false;
  filtrarPorPublicacion: boolean = false;
  filtrarPorProfesor: boolean = false;
  filtrarPorFechas: boolean = false;
  filtrarPorTipo: boolean = false;
  selectedInstituto: number | null = null;
  selectedPublicacion: string | undefined;
  selectedProfesor: number | null = null;
  publicacion: any[] = [];
  profesores: any[] = [];
  publicaciones: any[] = [];
  startDate: string = '';
  endDate: string = '';
  articulos: any[] = [];
  institutos: any[] = [];

  constructor(
    private articuloService: ArticuloService,
    private autorService: AutorService,
    private institutoService: InstitutoService
  ) { }

  ngOnInit(): void {
    this.articuloService.getList().subscribe(
      (data: any[]) => {
        this.articulos = data;
      },
      (error: any) => {
        console.error('Error al obtener los artículos:', error);
      }
    );

    this.institutoService.getList().subscribe(
      (data: any[]) => {
        this.institutos = data;
      },
      (error: any) => {
        console.error('Error al obtener los institutos:', error);
      }
    );

    this.autorService.getList().subscribe(
      (data: any[]) => {
        this.profesores = data;
        console.log('Profesores cargados:', this.profesores);
      },
      (error: any) => {
        console.error('Error al obtener los profesores:', error);
      }
    );
  }

  reporteExe() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    console.log('Filtrar por Instituto:', this.filtrarPorInstituto);
    console.log('Instituto seleccionado:', this.selectedInstituto);
    console.log('Filtrar por Profesor:', this.filtrarPorProfesor);
    console.log('Profesor seleccionado:', this.selectedProfesor);
    if (this.filtrarPorInstituto && this.selectedInstituto !== null && this.filtrarPorProfesor && this.selectedProfesor !== null) {
      const institutoId = this.selectedInstituto;
      const profesorId = this.selectedProfesor;
      console.log(`Instituto ID: ${institutoId}, Profesor ID (antes de la conversión): ${this.selectedProfesor}`);
      console.log(`Profesor ID (después de la conversión): ${profesorId}`);

      if (!isNaN(institutoId) && !isNaN(profesorId)) {
        console.log(`Instituto ID: ${institutoId}, Profesor ID: ${profesorId}`);
        this.articuloService.reporteExeIstInv(institutoId, profesorId).subscribe(response => {
          this.downloadFile(response);
        });
      } else {
        console.error('El ID del instituto o del profesor no es válido.');
      }
    } else if (this.filtrarPorInstituto && this.selectedInstituto !== null) {
      const institutoId = this.selectedInstituto;
      if (!isNaN(institutoId)) {
        console.log(`Instituto ID: ${institutoId}`);
        this.articuloService.reporteExeIst(institutoId).subscribe(response => {
          this.downloadFile(response);
        });
      } else {
        console.error('El ID del instituto no es válido.');
      }
    } else {
      console.log('Generando reporte general');
      this.articuloService.reporteExe().subscribe(response => {
        this.downloadFile(response);
      });
    }
  }


  private downloadFile(response: Blob) {
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Articulos_${new Date().toISOString()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  searchPublications(): void {
    const searchCriteria = {
      instituto: this.selectedInstituto,
    };

    this.articuloService.searchPublications(searchCriteria).subscribe(data => {
      this.publicaciones = data;
    });
  }

  trackById(index: number, articulo: any): number {
    return articulo.id;
  }

  editarArticulo(articulo: any) {
    // Lógica para editar el artículo, por ejemplo redirigir a una página de edición.
    console.log('Editar artículo:', articulo);
  }

  darDeBajaArticulo(articulo: any) {
    // Lógica para dar de baja el artículo, por ejemplo mostrar un mensaje de confirmación.
    console.log('Dar de baja artículo:', articulo);
  }

}