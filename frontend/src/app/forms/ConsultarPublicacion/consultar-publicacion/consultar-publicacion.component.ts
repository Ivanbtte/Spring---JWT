import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Investigador } from 'src/app/services/auth/investigador';
import { AutorService } from 'src/app/services/autor/autor.service';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { InstitutoService } from 'src/app/services/instituto/instituto.service';
import { InvestigadorService } from 'src/app/services/investigador/investigador.service';
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
  selectedInstituteForProfessor:  number | null = null;

  publicacion: any[] = [];
  tipo_publicaciones: any[] = [];//En uso
  profesores: any[] = [];//En uso
  publicaciones: any[] = [];
  startDate: string = '';
  endDate: string = '';
  articulos: any[] = [];//En uso
  institutos: any[] = [];//En uso
  articulosFiltrados: any[] = [];
  investigadores: any[] = [];
  selectedInvestigador: any[] = [];
  profesoresFiltrados: any[] = [];
  dataService: any;


  constructor(
    private articuloService: ArticuloService,
    private autorService: AutorService,
    private institutoService: InstitutoService,
    private catalogoService: CatalogoService,
    private investigadorService: InvestigadorService,
    private router: Router
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
      institutoId: this.filtrarPorInstituto ? this.selectedInstituto || null : null,
      autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
      fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null,
      fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null,
      tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
    };
  
    console.log("Criterios de búsqueda enviados:", searchCriteria);
  
    this.articuloService.searchPublications(searchCriteria).subscribe(data => {
      console.log("Datos recibidos del backend:", data);
      this.articulosFiltrados = this.convertirDatos(data);
      
      // Ordenar los artículos por nombre_articulo
      this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => {
        const nombreA = a.nombre_articulo?.toLowerCase() ?? '';
        const nombreB = b.nombre_articulo?.toLowerCase() ?? '';
        return nombreA.localeCompare(nombreB);
      });
      
      console.log("Datos ordenados:", this.articulosFiltrados);
    }, error => {
      console.error('Error al buscar publicaciones:', error);
    });
  }
  
  

  convertirDatos(data: any[]): any[] {
    return data.map(arr => {
      return {
        propiedad1: arr[0],
        propiedad2: arr[1],
        id_articulo: arr[6],
        aceptado_director: arr[22],
        aceptado_gestion: arr[22],
        titulo_revista: arr[19],      //estaba en 15 para pruebas de Leonel se cambio a 19
        fecha_publicacion: arr[5],
        nombre_articulo: arr[15]      //estaba en 19... se cambiara a 15
        // Sigue mapeando todas las propiedades necesarias
      };
    });
  }
  

  trackById(index: number, articulo: any): number {
    return articulo.id;
  }

  editarArticulo(articulo: any) {
    console.log('Editar artículo:', articulo);
    this.router.navigate(['/validar-publicacion', articulo.id_articulo]);
  }

  darDeBajaArticulo(articulo: any) {
    // Lógica para dar de baja el artículo, por ejemplo mostrar un mensaje de confirmación.
    console.log('Dar de baja artículo:', articulo);
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

  onInstituteChange(): void {
    this.getInvestigadorByInstitute();
  }

  onInstituteForProfessorChange(): void {
    this.getInvestigadorByInstitute();
  }

  getInvestigadorByInstitute(): void {
    if (this.selectedInstituteForProfessor) {
      this.investigadorService.getInvestigadorByInstitute(this.selectedInstituteForProfessor).subscribe(
        data => {
          this.profesores = data;
          this.profesoresFiltrados = this.profesores;
        },
      );
    } else {
      this.profesores = [];
      this.profesoresFiltrados = [];
      console.log('No se seleccionó ningún instituto, lista de profesores vacía');
    }
  }

  onFilterChange(): void {
    if (this.filtrarPorInstituto && this.selectedInstituto) {
      this.investigadorService.getInvestigadorByInstitute(this.selectedInstituto).subscribe(
        data => {
          this.profesoresFiltrados = data;
        },
        error => console.error('Error al obtener los investigadores por instituto:', error)
      );
    } else {
      this.investigadorService.getInvestigadores().subscribe(
        data => {
          this.profesoresFiltrados = data;
        },
        error => console.error('Error al obtener los investigadores:', error)
      );
    }
  }
  onCheckboxChange(filter: string): void {
    switch (filter) {
      case 'instituto':
        if (!this.filtrarPorInstituto) {
          this.selectedInstituto = null;
        }
        break;
      case 'profesor':
        if (!this.filtrarPorProfesor) {
          this.selectedInstituteForProfessor = null;
          this.selectedProfesor = null;
          this.profesoresFiltrados = [];
        }
        break;
      case 'fechas':
        if (!this.filtrarPorFechas) {
          this.startDate = '';
          this.endDate = '';
        }
        break;
      case 'tipo':
        if (!this.filtrarPorTipo) {
          this.selectedTipoPublicacion = null;
        }
        break;
    }
  }
}