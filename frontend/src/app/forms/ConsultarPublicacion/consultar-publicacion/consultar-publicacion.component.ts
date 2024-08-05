import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { AutorService } from 'src/app/services/autor/autor.service';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
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
  selectedTipoPublicacion: number | null = null;

  publicacion: any[] = [];
  tipo_publicaciones: any[] = [];//En uso
  profesores: any[] = [];//En uso
  publicaciones: any[] = [];
  startDate: string = '';
  endDate: string = '';
  articulos: any[] = [];//En uso
  institutos: any[] = [];//En uso


  constructor(
    private articuloService: ArticuloService,
    private autorService: AutorService,
    private institutoService: InstitutoService,
    private catalogoService: CatalogoService
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
      },
      (error: any) => {
        console.error('Error al obtener los profesores:', error);
      }
    );

    this.catalogoService.getTiposPublicacion().subscribe(
      (data: any[]) => {
        this.tipo_publicaciones = data;
        console.log(data);
      },
      (error: any) => {
        console.error('Error al obtener los tipos de publicaciones', error);
      })
  }

  /*reporteExe1() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    if (this.filtrarPorInstituto && this.selectedInstituto !== null) {
      const institutoId = this.selectedInstituto;

      if (this.filtrarPorProfesor && this.selectedProfesor !== null) {
        const profesorId = this.selectedProfesor;

        if (this.filtrarPorTipo && this.selectedTipoPublicacion !== null) {
          const tipoPublicacionId = this.selectedTipoPublicacion;

          if (!isNaN(institutoId) && !isNaN(profesorId) && !isNaN(tipoPublicacionId)) {
            console.log(`Instituto ID: ${institutoId}, Profesor ID: ${profesorId}, Tipo de Publicación ID: ${tipoPublicacionId}`);
            this.articuloService.reporteExe_Instituto_Investigador_TipoPublicacion(institutoId, profesorId, tipoPublicacionId).subscribe(response => {
              this.downloadFile(response);
            });
          } else {
            console.error('El ID del instituto, del profesor, o del tipo de publicación no es válido.');
          }

        } else if (!isNaN(institutoId) && !isNaN(profesorId)) {
          console.log(`Instituto ID: ${institutoId}, Profesor ID: ${profesorId}`);
          this.articuloService.reporteExe_Instituto_Investigador(institutoId, profesorId).subscribe(response => {
            this.downloadFile(response);
          });
        } else {
          console.error('El ID del instituto o del profesor no es válido.');
        }

      } else if (this.filtrarPorTipo && this.selectedTipoPublicacion !== null) {
        const tipoPublicacionId = this.selectedTipoPublicacion;

        if (!isNaN(institutoId) && !isNaN(tipoPublicacionId)) {
          console.log(`Instituto ID: ${institutoId}, Tipo de Publicación ID: ${tipoPublicacionId}`);
          this.articuloService.reporteExe_Instituto_TipoPublicacion(institutoId, tipoPublicacionId).subscribe(response => {
            this.downloadFile(response);
          });
        } else {
          console.error('El ID del instituto o del tipo de publicación no es válido.');
        }

      } else if (!isNaN(institutoId)) {
        this.articuloService.reporteExe_Instituto(institutoId).subscribe(response => {
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
  }*/

  reporteExe() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    if (this.filtrarPorInstituto && this.selectedInstituto !== null) {
      const institutoId = this.selectedInstituto;
  
      if (this.filtrarPorProfesor && this.selectedProfesor !== null) {
        const profesorId = this.selectedProfesor;
  
        if (this.filtrarPorTipo && this.selectedTipoPublicacion !== null) {
          const tipoPublicacionId = this.selectedTipoPublicacion;
  
          if (!isNaN(institutoId) && !isNaN(profesorId) && !isNaN(tipoPublicacionId)) {
            console.log(`Instituto ID: ${institutoId}, Profesor ID: ${profesorId}, Tipo de Publicación ID: ${tipoPublicacionId}`);
            this.articuloService.reporteExe_Instituto_Investigador_TipoPublicacion(institutoId, profesorId, tipoPublicacionId).subscribe(response => {
              this.downloadFile(response);
            });
          } else {
            console.error('El ID del instituto, del profesor, o del tipo de publicación no es válido.');
          }
  
        } else if (!isNaN(institutoId) && !isNaN(profesorId)) {
          console.log(`Instituto ID: ${institutoId}, Profesor ID: ${profesorId}`);
          this.articuloService.reporteExe_Instituto_Investigador(institutoId, profesorId).subscribe(response => {
            this.downloadFile(response);
          });
        } else {
          console.error('El ID del instituto o del profesor no es válido.');
        }
  
      } else if (this.filtrarPorTipo && this.selectedTipoPublicacion !== null) {
        const tipoPublicacionId = this.selectedTipoPublicacion;
  
        if (!isNaN(institutoId) && !isNaN(tipoPublicacionId)) {
          console.log(`Instituto ID: ${institutoId}, Tipo de Publicación ID: ${tipoPublicacionId}`);
          this.articuloService.reporteExe_Instituto_TipoPublicacion(institutoId, tipoPublicacionId).subscribe(response => {
            this.downloadFile(response);
          });
        } else {
          console.error('El ID del instituto o del tipo de publicación no es válido.');
        }
  
      } else if (!isNaN(institutoId)) {
        this.articuloService.reporteExe_Instituto(institutoId).subscribe(response => {
          this.downloadFile(response);
        });
      } else {
        console.error('El ID del instituto no es válido.');
      }
    } else if (this.filtrarPorProfesor && this.selectedProfesor !== null) {
      const profesorId = this.selectedProfesor;
  
      if (!isNaN(profesorId)) {
        console.log(`Profesor ID: ${profesorId}`);
        this.articuloService.reporteExe_Profesor(profesorId).subscribe(response => {
          this.downloadFile(response);
        });
      } else {
        console.error('El ID del profesor no es válido.');
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