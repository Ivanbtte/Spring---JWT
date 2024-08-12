import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Articulo } from 'src/app/services/articulo/articulo';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  compilado: boolean = false;
  prodep: boolean = false;

  // Datos adicionales para Libro
  tituloLibro: string = '';
  editorialLibro: string = '';
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
    if (investigador.agregado == true) {
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

        // Validar que ambos campos estén seleccionados
        const investigador = this.investigadores[index];
        if (!investigador.instituto || !investigador.autorUnsisSeleccionado) {
            Swal.fire('Error', 'Debe seleccionar un instituto y un autor antes de continuar', 'error');
            return;
        }
    this.idsAutores.push(idAutor);
    this.investigadores[index].agregado = true; // Bandera para deshabilitar elementos
    this.investigadores[index].id_autor = idAutor;
    console.log("ID de autores: ", this.idsAutores);
  }

  validarRegistroAutores(): boolean {
    return this.investigadores.some(investigador => investigador.agregado);
  }
  agregarAutorNoUnsis(investigador: any, index: number) {
        // Validar que nombre1Autor y apellidoPaternoAutor no estén vacíos
        if (!investigador.primerNombre || !investigador.apellidoPaterno) {
          Swal.fire('Error', 'El primer nombre y el apellido paterno son obligatorios', 'error');
          return;
      }
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

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  validarCampos(): boolean {
    // Validar campos obligatorios
    if (!this.titulo.trim()) {
      Swal.fire('Error', 'El título del artículo es obligatorio', 'error');
      return false;
    }
    if (!this.nombreRevista.trim()) {
      Swal.fire('Error', 'El nombre de la revista es obligatorio', 'error');
      return false;
    }
    if (!this.selectedInstitutoPublicacion) {
      Swal.fire('Error', 'El instituto de afiliación es obligatorio', 'error');
      return false;
    }
    if (!this.fechaPublicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria', 'error');
      return false;
    }
    if (!this.selectedTrimestre) {
      Swal.fire('Error', 'El trimestre es obligatorio', 'error');
      return false;
    }
    const numVolumen = Number(this.numVolumen);
    if (numVolumen <= 0 || !Number.isInteger(numVolumen)) {
      Swal.fire('Error', 'El número de volumen debe ser un número positivo', 'error');
      return false;
    }
    if (!this.numEmision || this.numEmision <= 0) {
      Swal.fire('Error', 'El número de emisión debe ser un número positivo', 'error');
      return false;
    }
    if (!this.paginaInicio || this.paginaInicio <= 0) {
      Swal.fire('Error', 'La página de inicio debe ser un número positivo', 'error');
      return false;
    }
    if (!this.paginaFin || this.paginaFin <= this.paginaInicio) {
      Swal.fire('Error', 'La página final debe ser mayor a la página de inicio', 'error');
      return false;
    }
    if (!this.doi.trim()) {
      Swal.fire('Error', 'El DOI es obligatorio', 'error');
      return false;
    }

    // Validar investigadores no UNSIS
    for (const investigador of this.investigadores) {
      if (!investigador.autorUnsis) {
        if (!this.validarNombre(investigador.primerNombre)) {
          Swal.fire('Error', 'El primer nombre del investigador no UNSIS es obligatorio y debe comenzar con una letra mayúscula', 'error');
          return false;
        }
        if (!this.validarNombre(investigador.apellidoPaterno)) {
          Swal.fire('Error', 'El apellido paterno del investigador no UNSIS es obligatorio y debe comenzar con una letra mayúscula', 'error');
          return false;
        }
      }
    }

    return true;
  }

  validarNombre(nombre: string): boolean {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/;
    return regex.test(nombre.trim());
  }


  crearArticulo() {
    if (!this.validarCampos()) {
      return;
    }
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de registrar la publicación.', 'error');
      return;
    }
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
      Swal.fire('Éxito', 'Artículo registrado exitosamente', 'success');
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
      Swal.fire('Error', 'Error al registrar el artículo', 'error');
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
      isbn_digital: this.isbnDigital,
      isbn_impreso: this.isbnImpreso,
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

  crearCapitulo() {
    console.log("este es el id ", this.selectedInstitutoPublicacion);
    const articulo: Articulo = {
      tipoPublicacion: {
        id_publicacion_tipo: 2,
        nombre: 'capitulo'
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
      nombre_capitulo: this.tituloCapitulo,
      nombre_articulo: this.tituloLibro,
      editorial: this.editorialCapitulo,
      pag_inicio: this.paginaInicio,
      pag_final: this.paginaFin,
      isbn_digital: this.isbnDigital,
      isbn_impreso: this.isbnImpreso,
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


  onKeyPress(event: KeyboardEvent, field: string): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    // Verifica si el carácter es una letra o espacio.
    if (!/^[a-zA-Z]$/.test(char)) {
      // Prevenir la entrada del carácter no permitido.
      event.preventDefault();
    }
  }

  onInput(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    let valor = inputElement.value;
    // Elimina caracteres no permitidos
    valor = valor.replace(/[^a-zA-Z]/g, '');
    // Convertir a mayúscula la primera letra y el resto a minúsculas
    valor = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
    // Asigna el valor limpio de nuevo al campo de entrada
    inputElement.value = valor;
    // Actualiza el modelo ngModel si es necesario
    this[field] = valor;
  }
  onKeyPressNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);

    // Verifica si el carácter es un número (0-9)
    if (!/^\d$/.test(char)) {
      // Prevenir la entrada de caracteres no permitidos
      event.preventDefault();
    }
  }

}


