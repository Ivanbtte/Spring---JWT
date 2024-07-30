import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';

@Component({
  selector: 'app-registrar-publicacion',
  templateUrl: './registrar-publicacion.component.html',
  styleUrls: ['./registrar-publicacion.component.css']
})
export class RegistrarPublicacionComponent implements OnInit {
  volumen: any;
  emision: any;
  paginas: any;
  institutos: any[] = [];  // Lista de institutos
  autoresPorInstituto: any[][] = [];  // Lista de autores por instituto
  idsAutoresUnsis: number[] = []; // Variable para almacenar los IDs de autores UNSIS
  idsAutoresNoUnsis: number[] = []; // Variable para almacenar la propiedad autor.id_autor

  constructor(private articuloService: ArticuloService) { }

  ngOnInit(): void {
    // Llama al método para obtener los institutos cuando se inicializa el componente
    this.articuloService.getInstitutos().subscribe(
      (data: any[]) => {
        this.institutos = data;
      },
      (error) => {
        console.error('Error al obtener institutos', error);
      }
    );
  }

  tiposPublicacion: string[] = [
    'Artículo', 'Artículo en revista indexada', 'Artículo en revista online', 'Capítulo de libro', 'Libro'
  ];
  rolesColaboradores: string[] = ['Autor', 'Traductor', 'Editor'];

  tipoPublicacion: string = '';
  titulo: string = '';
  nombreRevista: string = '';
  investigadores: any[] = [];
  numVolumen: number | null = null;
  numEmision: number | null = null;
  numArticulo: number | null = null;
  fechaPublicacion: string = '';
  paginaInicio: number | null = null;
  paginaFin: number | null = null;
  doi: string = '';
  estadoPublicacion: string = '';

  // Datos adicionales para Libro
  tituloLibro: string = '';
  lugarPublicacion: string = '';
  editorial: string = '';
  fechaPublicacionLibro: string = '';
  isbn: string = '';
  url: string = '';

  // Datos adicionales para Capítulo de Libro
  tituloCapitulo: string = '';
  nombreLibro: string = '';
  edicionLibro: string = '';
  paginaInicial: string = '';
  paginaFinal: string = '';
  fechaPublicacionCapitulo: string = '';
  editorialCapitulo: string = '';
  isbnCapitulo: string = '';
  urlCapitulo: string = '';

  // NUEVOS CAMPOS PARA CAPÍTULO EN REVISTA INDEXADA
  tituloRevista: string = ''; // Título de la Revista
  volumenRevista: string = ''; // Volumen de la Revista
  numeroRevista: string = ''; // Número de la Revista
  paginaInicioRevista: string = ''; // Página de inicio
  paginaFinRevista: string = ''; // Página final
  issnImpreso: string = ''; // ISSN versión impresa (opcional)
  issnOnline: string = ''; // ISSN versión en línea (opcional)

  agregarInvestigador() {
    this.investigadores.push({
      primerNombre: '',
      id_autor: '',
      apellido: '',
      agregado: false, // Bandera para verificar si el autor UNSIS ha sido agregado
      autorUnsis: false,
      instituto: '',
      autorUnsisSeleccionado: ''
    });
    this.autoresPorInstituto.push([]);
  }

  eliminarInvestigador(index: number) {
    const investigador = this.investigadores[index];

    if (investigador.autorUnsisSeleccionado) {
      const autorIdIndex = this.idsAutoresUnsis.indexOf(investigador.autorUnsisSeleccionado);
      if (autorIdIndex !== -1) {
        this.idsAutoresUnsis.splice(autorIdIndex, 1);
      }
      // Eliminar el investigador y sus datos relacionados
      this.investigadores.splice(index, 1);
      this.autoresPorInstituto.splice(index, 1);
    } else {
      const autorId = investigador.id_autor; // Asegúrate de que `idAutor` sea el ID correcto
      this.articuloService.eliminarAutorNoUnsis(autorId).subscribe(
        response => {
          console.log('Investigador eliminado', response);
          this.investigadores.splice(index, 1);
          this.autoresPorInstituto.splice(index, 1);

          // Eliminar el ID del array idsAutoresNoUnsis
          const autorIdIndex = this.idsAutoresNoUnsis.indexOf(autorId);
          if (autorIdIndex !== -1) {
            this.idsAutoresNoUnsis.splice(autorIdIndex, 1);
          }
        },
        error => {
          console.error('Error al eliminar investigador', error);
        }
      );
    }

  }

  onInstitutoChange(institutoId: string, investigadorIndex: number) {
    this.articuloService.getAutoresPorInstituto(institutoId).subscribe(
      (data: any[]) => {
        this.autoresPorInstituto[investigadorIndex] = data;
      },
      (error) => {
        console.error('Error al obtener autores por instituto', error);
      }
    );
  }

  guardarAutorUnsis(idAutor: number, index: number) {
    this.idsAutoresUnsis.push(idAutor);
    this.investigadores[index].agregado = true; // Bandera para deshabilitar elementos
  }

  agregarAutorNoUnsis(investigador: any, index: number) {
    const nuevoAutor = {
      nombre1Autor: investigador.primerNombre,
      nombre2Autor: investigador.segundoNombre,
      apellidoPaternoAutor: investigador.apellidoPaterno,
      apellidoMaternoAutor: investigador.apellidoMaterno,
      autorUnsis: false
    };

    this.articuloService.agregarAutorNoUnsis(nuevoAutor).subscribe(
      response => {
        console.log('Autor no UNSIS agregado:', response);
        investigador.id_autor = response.id_autor;
        this.idsAutoresNoUnsis.push(response.id_autor); // Agrega el ID al array
        // Aquí puedes agregar la lógica adicional que necesites después de agregar el autor no UNSIS
      },
      error => {
        console.error('Error al agregar autor no UNSIS:', error);
      }
    );

    investigador.agregado = true;
    
  }

  onAutorUnsisChange(investigador: any, index: number): void {
    if (!investigador.autorUnsis && investigador.agregado) {
      this.eliminarInvestigador(index);
    }
  }

}
