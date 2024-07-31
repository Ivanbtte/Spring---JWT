import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Articulo} from 'src/app/services/articulo/articulo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-publicacion',
  templateUrl: './registrar-publicacion.component.html',
  styleUrls: ['./registrar-publicacion.component.css']
})
export class RegistrarPublicacionComponent implements OnInit {

  investigadores: any[] = []; // Lista de investigadores
  institutos: any[] = [];
  institutosPublicacion: any[] = [];  // Lista de institutos
  autoresPorInstituto: any[][] = [];  // Lista de autores por instituto
  idsAutoresUnsis: number[] = []; // Variable para almacenar los IDs de autores UNSIS
  idsAutoresNoUnsis: number[] = []; // Variable para almacenar la propiedad autor.id_autor
  selectedInstitutoPublicacion: any;
  selectedTrimestre: any;
  trimestres: any[] = [];
  

  constructor(private articuloService: ArticuloService, private router: Router) { }

  ngOnInit(): void {
    // Llama al método para obtener los institutos cuando se inicializa el componente
    this.articuloService.getInstitutos().subscribe(
      (data: any[]) => {
        this.institutos = data;
        this.institutosPublicacion = data;
      },
      (error) => {
        console.error('Error al obtener institutos', error);
      }
    );

    // Llama al método para obtener los trimestres cuando se inicializa el componente
    this.articuloService.getTrimestres().subscribe(
      (data: any[]) => {
        this.trimestres = data;
      },
      (error) => {
        console.error('Error al obtener trimestres', error);
      }
    );
  }

  tipoPublicacion: string = ''; //Borrar posiblemente
  titulo: string = '';
  instituto: number = 0;
  nombreRevista: string = '';
  numVolumen: string = '';
  numEmision: number = 0;
  fechaPublicacion: Date | undefined;
  paginaInicio: number = 0;
  paginaFin: number = 0;
  doi: string = '';

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

  crearArticulo() {
    console.log("este es el id ", this.selectedInstitutoPublicacion);
    const articulo: Articulo = {
      tipoPublicacion: {
        id_publicacion_tipo: 1,
        nombre: 'Artículo'
      },
      instituto: {
        id: this.selectedInstitutoPublicacion,
        nombre: ''
      },
      trimestre: {
        id_trimestre: this.selectedTrimestre,
        nombre: '',
        fecha_inicio: new Date('2024-05-12'), //fecha falsa
        fecha_fin: new Date('2024-08-12') //fecha falsa
      },
      fecha_publicacion: this.fechaPublicacion,
      titulo_revista: this.nombreRevista,
      numero_revista: this.numEmision,
      volumen_revista: this.numVolumen,
      pag_inicio: this.paginaInicio,
      pag_final: this.paginaFin,
      doi: this.doi,
      nombre_articulo: this.titulo,
      compilado: false,
      financiamiento_prodep: false
    };
  
    this.articuloService.crearArticulo(articulo).subscribe(response => {
      console.log('Artículo registrado exitosamente', response);
      this.limpiarCampos();
      this.router.navigate(['/inicio']); // Redirige al inicio después de registrar el artículo
    }, error => {
      console.error('Error al registrar el artículo', error);
    });
  }

  limpiarCampos() {
    this.tipoPublicacion = '';
    this.titulo = '';
    this.nombreRevista = '';
    this.instituto = 0;
    this.investigadores = [];
    this.numVolumen = '';
    this.numEmision = 0;
    this.fechaPublicacion = undefined;
    this.paginaInicio = 0;
    this.paginaFin = 0;
    this.doi = '';
  }

}
