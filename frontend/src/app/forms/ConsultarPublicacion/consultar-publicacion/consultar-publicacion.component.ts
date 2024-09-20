import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { LoginService } from 'src/app/services/auth/login.service';
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
  p: number = 1; // Página inicial
  filtrarPorInstituto: boolean = false;
  filtrarPorPublicacion: boolean = false;
  filtrarPorProfesor: boolean = false;
  filtrarPorFechas: boolean = false;
  filtrarPorTipo: boolean = false;
  selectedInstituto: number | null = null;
  selectedPublicacion: string | undefined;
  selectedProfesor: number | null = null;
  selectedTipoPublicacion: number | null = null;
  selectedInstituteForProfessor: number | null = null;
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
  //Variables extras:
  filtrarPorEstado: boolean = false;
  selectedEstado: string | null = null;
  filtrarPorTrimestre: boolean = false;
  trimestres: number[] = [1, 2, 3, 4];
  listaAnios: number[] = Array.from({ length: (new Date().getFullYear() - 2000 + 1) }, (v, k) => 2000 + k);
  selectedTrimestre: number | null = null;
  selectedAnio: number | null = null;
  userRole!: string;
  userInstituto!: string;
  userId!: number;

  constructor(
    private articuloService: ArticuloService,
    private autorService: AutorService,
    private institutoService: InstitutoService,
    private catalogoService: CatalogoService,
    private investigadorService: InvestigadorService,
    private router: Router,
    private loginService: LoginService,
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
      },
      (error: any) => {
        console.error('Error al obtener los tipos de publicaciones', error);
      })

    this.searchPublications();
  }

  reporteExe() {
    // Obtén los datos del usuario desde el LoginService
    this.userRole = this.loginService.getUserRole();
    this.userInstituto = this.loginService.getInstituto();
  
    // Define los criterios de búsqueda
    const searchCriteria = this.userRole === 'COORDINADOR'
      ? {
        institutoId: this.userInstituto,
        autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
        fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null || this.filtrarPorTrimestre ? (this.startDate || null) : null,
        fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null || this.filtrarPorTrimestre ? (this.endDate || null) : null,
        tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
      }
      : {
        institutoId: this.filtrarPorInstituto ? this.selectedInstituto || null : null,
        autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
        fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null || this.filtrarPorTrimestre ? (this.startDate || null) : null,
        fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null || this.filtrarPorTrimestre ? (this.endDate || null) : null,
        tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
      };

    // Establecer el encabezado 'Accept' para recibir un archivo Excel
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    // Llamada al servicio que exporta el Excel, pasando los criterios de búsqueda
    this.articuloService.reporteExe(searchCriteria).subscribe(response => {
      this.downloadFile(response);
    }, error => {
      console.error('Error al exportar el reporte:', error);
    });
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
    // Obtén los datos del usuario desde el LoginService
    this.userRole = this.loginService.getUserRole();
    this.userInstituto = this.loginService.getInstituto();
    if (this.userRole === 'COORDINADOR') {
      const searchCriteria = {
        institutoId: this.userInstituto,
        autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
        fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null || this.filtrarPorTrimestre ? (this.startDate || null) : null,
        fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null || this.filtrarPorTrimestre ? (this.endDate || null) : null,
        tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
        estatus: this.filtrarPorEstado ? this.selectedEstado || null : null,
      };
      this.articuloService.searchPublications(searchCriteria).subscribe(data => {
        this.articulosFiltrados = this.convertirDatos(data);
        // Ordenar los artículos por nombre_articulo
        this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => {
          const nombreA = a.nombre_articulo?.toLowerCase() ?? '';
          const nombreB = b.nombre_articulo?.toLowerCase() ?? '';
          return nombreA.localeCompare(nombreB);
        });
      }, error => {
        console.error('Error al buscar publicaciones:', error);
      });
    } else {
      const searchCriteria = {
        institutoId: this.filtrarPorInstituto ? this.selectedInstituto || null : null,
        autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
        fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null || this.filtrarPorTrimestre ? (this.startDate || null) : null,
        fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null || this.filtrarPorTrimestre ? (this.endDate || null) : null,
        tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
        estatus: this.filtrarPorEstado ? this.selectedEstado || null : null,
      };
      this.articuloService.searchPublications(searchCriteria).subscribe(data => {
        this.articulosFiltrados = this.convertirDatos(data);
        // Ordenar los artículos por nombre_articulo
        this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => {
          const nombreA = a.nombre_articulo?.toLowerCase() ?? '';
          const nombreB = b.nombre_articulo?.toLowerCase() ?? '';
          return nombreA.localeCompare(nombreB);
        });
      }, error => {
        console.error('Error al buscar publicaciones:', error);
      });
    }
  }


  dowloadZip(): void {
    const searchCriteria = {
      institutoId: this.filtrarPorInstituto ? this.selectedInstituto || null : null,
      autorId: this.filtrarPorProfesor ? this.selectedProfesor || null : null,
      fechaInicio: this.filtrarPorFechas ? (this.startDate || null) : null || this.filtrarPorTrimestre ? (this.startDate || null) : null,
      fechaFin: this.filtrarPorFechas ? (this.endDate || null) : null || this.filtrarPorTrimestre ? (this.endDate || null) : null,
      tipo: this.filtrarPorTipo ? this.selectedTipoPublicacion || null : null,
    };

    this.articuloService.dowloadzip(searchCriteria).subscribe(data => {
      const blob = new Blob([data], { type: 'application/zip' });
      saveAs(blob, 'archivos.zip'); // Asigna un nombre al archivo que se descargará
    }, error => {
      console.error('Error al descargar el zip', error);
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
        titulo_revista: arr[19],
        fecha_publicacion: arr[5],
        nombre_articulo: arr[15],
        observaciones_directores: arr[17],
        observaciones_gestion: arr[18]

        // Sigue mapeando todas las propiedades necesarias
      };
    });
  }

  trackById(index: number, articulo: any): number {
    return articulo.id;
  }

  editarArticulo(articulo: any) {
    this.router.navigate(['/validar-publicacion', articulo.id_articulo]);
  }

  darDeBajaArticulo(articulo: any) {
    console.info('Dar de baja artículo:', articulo);
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
    }
  }
  onEstadoChange() {
    // Lógica para manejar el cambio de estado.
    console.log('Estado cambiado:', this.selectedEstado);
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
        if (this.filtrarPorFechas) {
          this.filtrarPorTrimestre = false;
          this.selectedTrimestre = null;
          this.selectedAnio = null;
        }
        break;
      case 'trimestre':
        if (this.filtrarPorTrimestre) {
          this.filtrarPorFechas = false;
        }
        break;
      case 'tipo':
        if (!this.filtrarPorTipo) {
          this.selectedTipoPublicacion = null;
        }
        break;
      case 'estado':
          if (!this.filtrarPorEstado) {
            this.selectedEstado = null;
          }
          break;
    }
  }

  onTrimestreChange(): void {
    // Verifica que ambos valores no sean nulos o undefined
    if (this.selectedTrimestre !== null && this.selectedAnio !== null) {
      // Asegúrate de que `selectedTrimestre` y `selectedAnio` son números
      const trimestre = Number(this.selectedTrimestre);
      const anio = Number(this.selectedAnio);
      let startDate: string;
      let endDate: string;
      switch (trimestre) {
        case 1:
          startDate = `${anio}-01-01`;
          endDate = `${anio}-03-31`;
          break;
        case 2:
          startDate = `${anio}-04-01`;
          endDate = `${anio}-06-30`;
          break;
        case 3:
          startDate = `${anio}-07-01`;
          endDate = `${anio}-09-30`;
          break;
        case 4:
          startDate = `${anio}-10-01`;
          endDate = `${anio}-12-31`;
          break;
        default:
          console.error("Trimestre no válido:", trimestre);
          return;
      }

      // Asigna las fechas a las propiedades correspondientes
      this.startDate = startDate;
      this.endDate = endDate;
    } else {
      console.warn("No se seleccionaron ambos valores (trimestre o año).");
    }
  }
}