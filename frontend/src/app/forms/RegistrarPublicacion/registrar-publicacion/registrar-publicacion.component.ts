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

  [key: string]: any;

  investigadores: any[] = []; // Lista de investigadores
  institutos: any[] = [];
  institutosPublicacion: any[] = [];  // Lista de institutos
  autoresPorInstituto: any[][] = [];  // Lista de autores por instituto
  idsAutores: number[] = []; // Variable para almacenar los IDs de autores UNSIS
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
  miar: string = '';
  compilado: boolean=false;
  prodep: boolean=false;

  // Datos adicionales para Libro
  tituloLibro: string = '';
  editorialLibro: string='';
  lugarPublicacion: string = '';
  editorial: string = '';
  fechaPublicacionLibro: string = '';
  isbnImpreso: string = '';
  isbnDigital: string = '';
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
      id_autor: Number,
      apellido: '',
      agregado: false, // Bandera para verificar si el autor UNSIS ha sido agregado
      autorUnsis: false,
      instituto: '',
      autorUnsisSeleccionado: ''
    });
    this.autoresPorInstituto.push([]);
    console.log("Investigadores: ", this.investigadores)
  }

  eliminarInvestigador(index: number) {
    const investigador = this.investigadores[index];
    if (investigador.agregado==true){
      if (investigador.autorUnsisSeleccionado) {
        const autorIdIndex = this.idsAutores.indexOf(investigador.autorUnsisSeleccionado);
        if (autorIdIndex !== -1) {
          this.idsAutores.splice(autorIdIndex, 1);
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
            const autorIdIndex = this.idsAutores.indexOf(autorId);
            if (autorIdIndex !== -1) {
              this.idsAutores.splice(autorIdIndex, 1);
            }
          },
          error => {
            console.error('Error al eliminar investigador', error);
          }
        );
      }
    }
    else {
      // Eliminar el investigador y sus datos relacionados
      this.investigadores.splice(index, 1);
      this.autoresPorInstituto.splice(index, 1);
    }
    console.log("ID de autores: ", this.idsAutores);

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
    this.idsAutores.push(idAutor);
    this.investigadores[index].agregado = true; // Bandera para deshabilitar elementos
    this.investigadores[index].id_autor = idAutor;
    console.log("ID de autores: ", this.idsAutores);
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
        this.idsAutores.push(response.id_autor); // Agrega el ID al array
        console.log("ID de autores: ", this.idsAutores);
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
      indice_miar: this.miar,
      compilado: this.compilado,
      financiamiento_prodep: this.prodep
    };

    this.articuloService.crearArticulo(articulo).subscribe(response => {
      console.log('Artículo registrado exitosamente', response);
      const articuloId = response.id_articulo;
      this.idsAutores.forEach((autorId, index) => {
        this.articuloService.agregarAutorArticulo(articuloId, autorId).subscribe(
          response => {
            console.log(`Autor ${autorId} agregado al artículo ${articuloId}`, response);
            if (index === this.idsAutores.length - 1) {
              this.limpiarCampos();
              this.router.navigate(['/inicio']); // Redirige al inicio después de registrar el artículo y agregar los autores
            }
          },
          error => {
            console.error(`Error al agregar autor ${autorId} al artículo ${articuloId}`, error);
          }
        );
      });
    }, error => {
      console.error('Error al registrar el artículo', error);
    });
  }

  crearLibro() {
    console.log("este es el id ", this.selectedInstitutoPublicacion);
    const articulo: Articulo = {
      tipoPublicacion: {
        id_publicacion_tipo: 3,
        nombre: 'Libro'
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
      nombre_articulo: this.tituloLibro,
      editorial: this.editorialLibro,
      isbn_digital:this.isbnDigital,
      isbn_impreso:this.isbnImpreso,
      indice_miar: this.miar,
      compilado: this.compilado,
      financiamiento_prodep: this.prodep
    };

    this.articuloService.crearArticulo(articulo).subscribe(response => {
      console.log('Artículo registrado exitosamente', response);
      const articuloId = response.id_articulo;
      this.idsAutores.forEach((autorId, index) => {
        this.articuloService.agregarAutorArticulo(articuloId, autorId).subscribe(
          response => {
            console.log(`Autor ${autorId} agregado al artículo ${articuloId}`, response);
            if (index === this.idsAutores.length - 1) {
              this.limpiarCampos();
              this.router.navigate(['/inicio']); // Redirige al inicio después de registrar el artículo y agregar los autores
            }
          },
          error => {
            console.error(`Error al agregar autor ${autorId} al artículo ${articuloId}`, error);
          }
        );
      });
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
    this.isbnDigital = '';
    this.isbnImpreso = '';
    this.miar = '';
    this.tituloLibro = '';
    this.editorialLibro = '';
  }

  onCheckboxChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this[field] = input.checked;
  }

}
