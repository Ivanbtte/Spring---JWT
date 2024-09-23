import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Articulo } from 'src/app/services/articulo/articulo';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FileService } from 'src/app/services/fileService/file.service';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-registrar-publicacion',
  templateUrl: './registrar-publicacion.component.html',
  styleUrls: ['./registrar-publicacion.component.css']
})
export class RegistrarPublicacionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  [key: string]: any;
  selectedFile!: File;
  renamedFile!: File;
  investigadores: any[] = []; // Lista de investigadores
  institutos: any[] = [];
  institutosPublicacion: any[] = [];  // Lista de institutos
  autoresPorInstituto: any[][] = [];  // Lista de autores por instituto
  idsAutores: number[] = []; // Variable para almacenar los IDs de autores UNSIS
  selectedInstitutoPublicacion: any;
  selectedTrimestre: any;
  trimestres: any[] = [];
  // Variables para manejar el rango de fechas
  fechaInicioPermitida!: Date;
  fechaFinPermitida!: Date;
  fileName: string = '';


  constructor(private articuloService: ArticuloService, private router: Router, private fileService: FileService, private loginService: LoginService) {
    this.investigadores.push({ rol: 'Autor', agregado: false });
   }

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

  file!: number;
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
      rol: 'Autor', // Aquí se inicializa el rol por defecto
      agregado: false, // Bandera para verificar si el autor UNSIS ha sido agregado
      autorUnsis: false,
      instituto: '',
      autorUnsisSeleccionado: ''
    });
    this.autoresPorInstituto.push([]);
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

  onTrimestreChange(): void {
    if (this.selectedTrimestre) {
      const trimestreSeleccionado = this.trimestres.find(t => t.id_trimestre === Number(this.selectedTrimestre));
      if (trimestreSeleccionado) {
        // Establece las fechas permitidas basadas en el trimestre seleccionado
        this.fechaInicioPermitida = new Date(trimestreSeleccionado.fecha_inicio);
        this.fechaInicioPermitida.setDate(this.fechaInicioPermitida.getDate() - 7); // Permite seleccionar 1 semana antes

        this.fechaFinPermitida = new Date(trimestreSeleccionado.fecha_fin); // Fecha de fin del trimestre
      }
    }
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
        investigador.id_autor = response.id_autor;
        this.idsAutores.push(response.id_autor); // Agrega el ID al array
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
    if (!this.renamedFile) {
      Swal.fire('Error', 'Debe subir su evidencia en PDF antes de registrar la publicación', 'error');
      return false;
    }

    return true;
  }


  ValidarLibro(): boolean {
    // Validar campos obligatorios
    if (!this.tituloLibro || !this.tituloLibro.trim()) {
      Swal.fire('Error', 'El título del libro es obligatorio', 'error');
      return false;
    }

    if (!this.editorialLibro || !this.editorialLibro.trim()) {
      Swal.fire('Error', 'La editorial del libro es obligatoria', 'error');
      return false;
    }

    if (!this.selectedInstitutoPublicacion) {
      Swal.fire('Error', 'El instituto de afiliación es obligatorio', 'error');
      return false;
    }

    if (!this.selectedTrimestre) {
      Swal.fire('Error', 'El trimestre es obligatorio', 'error');
      return false;
    }

    if (!this.fechaPublicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria', 'error');
      return false;
    }

    // Validar que al menos uno de los ISBN esté presente
    if (!this.isbnImpreso && !this.isbnDigital) {
      Swal.fire('Error', 'Debe proporcionar al menos un ISBN (impreso o digital)', 'error');
      return false;
    }
    // Validar que un archivo PDF haya sido seleccionado
    if (!this.renamedFile) {
      Swal.fire('Error', 'Debe subir un evidencia en PDF antes de registrar la publicación', 'error');
      return false;
    }
    return true;
  }

  validarCap(): boolean {
    if (!this.tituloCapitulo) {
      Swal.fire('Error', 'El título del capítulo es obligatorio.', 'error');
      return false;
    }
    if (!this.tituloLibro) {
      Swal.fire('Error', 'El título del libro es obligatorio.', 'error');
      return false;
    }
    if (!this.editorialCapitulo) {
      Swal.fire('Error', 'La editorial es obligatoria.', 'error');
      return false;
    }
    if (!this.selectedInstitutoPublicacion) {
      Swal.fire('Error', 'El instituto de afiliación es obligatorio.', 'error');
      return false;
    }
    if (!this.selectedTrimestre) {
      Swal.fire('Error', 'El trimestre es obligatorio.', 'error');
      return false;
    }
    if (!this.fechaPublicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria.', 'error');
      return false;
    }
    if (this.paginaFin < this.paginaInicio) {
      Swal.fire('Error', 'La página final debe ser mayor o igual a la página de inicio.', 'error');
      return false;
    }
    if (!this.isbnImpreso && !this.isbnDigital) {
      Swal.fire('Error', 'Debes proporcionar al menos un ISBN (impreso o digital).', 'error');
      return false;
    }
    // Validar que un archivo PDF haya sido seleccionado
    if (!this.renamedFile) {
      Swal.fire('Error', 'Debe subir su evidencia en PDF antes de registrar la publicación', 'error');
      return false;
    }
    return true;
  }


  validarNombre(nombre: string): boolean {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ'´]*$/;
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
    Swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de registrar el capítulo. ¿Desea continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar la alerta de carga
        Swal.fire({
          title: 'Cargando...',
          text: 'Su publicación está siendo procesada, por favor espere.',
          allowOutsideClick: false,  // No permite cerrar la alerta al hacer clic fuera
          allowEscapeKey: false,     // No permite cerrar la alerta con la tecla escape
          showConfirmButton: false,  // No muestra botón de confirmación
          willOpen: () => {
            Swal.showLoading();     // Muestra el indicador de carga
          }
        });
  
        // Asegurarse de que this.fechaPublicacion no sea undefined, y asignar una fecha predeterminada si es necesario
        const fechaPublicacionAjustada = this.fechaPublicacion ? new Date(this.fechaPublicacion) : new Date();
        fechaPublicacionAjustada.setDate(fechaPublicacionAjustada.getDate() + 1);
  
        // Subir archivo
        this.fileService.uploadFile(this.renamedFile).subscribe({
          next: (response) => {
            this.file = response.id;
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
              fileMetadata: {
                id: this.file,
                fileName: '',
                filePath: '',
                fileType: ''
              },
              fecha_publicacion: fechaPublicacionAjustada,
              titulo_revista: this.nombreRevista,
              numero_revista: this.numEmision,
              volumen_revista: this.numVolumen,
              pag_inicio: this.paginaInicio,
              pag_final: this.paginaFin,
              doi: this.doi,
              nombre_articulo: this.titulo,
              indice_miar: this.miar,
              compilado: false,
              financiamiento_prodep: this.prodep,
              aceptado_director: false,
              aceptado_gestion: false,
              estatus: 1
            };
  
            // Crear el artículo
            this.articuloService.crearArticulo(articulo).subscribe(response => {
              const articuloId = response.id_articulo;
              this.idsAutores.forEach((autorId, index) => {
                // Agregar autores al artículo
                this.articuloService.agregarAutorArticulo(articuloId, autorId, "Autor").subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${articuloId}`, response);
                    if (index === this.idsAutores.length - 1) {
                      // Limpiar campos y redirigir después de agregar el último autor
                      this.limpiarCampos();
                      Swal.close();  // Cerrar la alerta de carga
                      Swal.fire('Éxito', 'Artículo registrado exitosamente', 'success');
                       // Obtener el rol del usuario desde el servicio login
                    const rolUsuario = this.loginService.getUserRole();  // Llamar al método que obtiene el rol

                    // Enrutamiento basado en el rol del usuario
                    if (rolUsuario === 'ADMIN' || rolUsuario === 'ROOT') {
                      this.router.navigate(['/consultar-publicacion']);
                    } else {
                      this.router.navigate(['/mis-publicaciones']);
                    }
                  }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${articuloId}`, error);
                  }
                );
              });
            }, error => {
              Swal.close();  // Cerrar la alerta de carga si hay un error
              Swal.fire('Error', 'Error al registrar el artículo', 'error');
            });
          },
          error: (error) => {
            console.error('Error al subir el archivo', error);
            Swal.close();  // Cerrar la alerta de carga si hay un error
            Swal.fire('Error', 'Error al subir el archivo', 'error');
          }
        });
      }
    });
  }

  crearLibro() {
    if (!this.ValidarLibro()) {
      return;
    }
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de registrar la publicación.', 'error');
      return;
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de registrar el libro. ¿Desea continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar la alerta de carga
        Swal.fire({
          title: 'Cargando...',
          text: 'Su publicación está siendo procesada, por favor espere.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
  
        const fechaPublicacionAjustada = this.fechaPublicacion ? new Date(this.fechaPublicacion) : new Date();
        fechaPublicacionAjustada.setDate(fechaPublicacionAjustada.getDate() + 1);
  
        this.fileService.uploadFile(this.renamedFile).subscribe({
          next: (response) => {
            this.file = response.id;
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
                fecha_inicio: new Date('2024-05-12'), // fecha falsa
                fecha_fin: new Date('2024-08-12') // fecha falsa
              },
              fileMetadata: {
                id: this.file,
                fileName: '',
                filePath: '',
                fileType: ''
              },
              fecha_publicacion: fechaPublicacionAjustada,
              nombre_articulo: this.tituloLibro,
              editorial: this.editorialLibro,
              isbn_digital: this.isbnDigital,
              isbn_impreso: this.isbnImpreso,
              indice_miar: this.miar,
              compilado: false,
              financiamiento_prodep: this.prodep,
              aceptado_director: false,
              aceptado_gestion: false,
              estatus: 1
            };
  
            this.articuloService.crearArticulo(articulo).subscribe(response => {
              const articuloId = response.id_articulo;
              this.idsAutores.forEach((autorId, index) => {
                this.articuloService.agregarAutorArticulo(articuloId, autorId, "Autor").subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${articuloId}`, response);
                    if (index === this.idsAutores.length - 1) {
                      this.limpiarCampos();
                      Swal.close();  // Cerrar la alerta de carga
                      Swal.fire('Éxito', 'Libro registrado exitosamente', 'success');
                       // Obtener el rol del usuario desde el servicio login
                    const rolUsuario = this.loginService.getUserRole();  // Llamar al método que obtiene el rol

                    // Enrutamiento basado en el rol del usuario
                    if (rolUsuario === 'ADMIN' || rolUsuario === 'ROOT') {
                      this.router.navigate(['/consultar-publicacion']);
                    } else {
                      this.router.navigate(['/mis-publicaciones']);
                    }
                  }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${articuloId}`, error);
                  }
                );
              });
            }, error => {
              Swal.close();  // Cerrar la alerta de carga si hay un error
              Swal.fire('Error', 'Error al registrar el libro', 'error');
            });
          },
          error: (error) => {
            console.error('Error al subir el archivo', error);
            Swal.close();  // Cerrar la alerta de carga si hay un error
            Swal.fire('Error', 'Error al subir el archivo', 'error');
          }
        });
      }
    });
  }

  crearCapitulo() {
    if (!this.validarCap()) {
      return;
    }
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de registrar la publicación.', 'error');
      return;
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de registrar el capítulo. ¿Desea continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar la alerta de carga
        Swal.fire({
          title: 'Cargando...',
          text: 'Su publicación está siendo procesada, por favor espere.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
  
        const fechaPublicacionAjustada = this.fechaPublicacion ? new Date(this.fechaPublicacion) : new Date();
        fechaPublicacionAjustada.setDate(fechaPublicacionAjustada.getDate() + 1);
  
        this.fileService.uploadFile(this.renamedFile).subscribe({
          next: (response) => {
            this.file = response.id;
            const articulo: Articulo = {
              tipoPublicacion: {
                id_publicacion_tipo: 2,
                nombre: 'Capítulo'
              },
              instituto: {
                id: this.selectedInstitutoPublicacion,
                nombre: ''
              },
              trimestre: {
                id_trimestre: this.selectedTrimestre,
                nombre: '',
                fecha_inicio: new Date('2024-05-12'), // fecha falsa
                fecha_fin: new Date('2024-08-12') // fecha falsa
              },
              fileMetadata: {
                id: this.file,
                fileName: '',
                filePath: '',
                fileType: ''
              },
              fecha_publicacion: fechaPublicacionAjustada,
              nombre_capitulo: this.tituloCapitulo,
              nombre_articulo: this.tituloLibro,
              editorial: this.editorialCapitulo,
              pag_inicio: this.paginaInicio,
              pag_final: this.paginaFin,
              isbn_digital: this.isbnDigital,
              isbn_impreso: this.isbnImpreso,
              indice_miar: this.miar,
              compilado: false,
              financiamiento_prodep: this.prodep,
              aceptado_director: false,
              aceptado_gestion: false,
              estatus: 1
            };
  
            this.articuloService.crearArticulo(articulo).subscribe(response => {
              const articuloId = response.id_articulo;
              this.idsAutores.forEach((autorId, index) => {
                const investigador = this.investigadores[index];  // Obtener el investigador correspondiente
                this.articuloService.agregarAutorArticulo(articuloId, autorId, investigador.rol).subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${articuloId}`, response);
                    if (index === this.idsAutores.length - 1) {
                      this.limpiarCampos();
                      Swal.close();  // Cerrar la alerta de carga
                      Swal.fire('Éxito', 'Capítulo registrado exitosamente', 'success');
                    // Obtener el rol del usuario desde el servicio login
                    const rolUsuario = this.loginService.getUserRole();  // Llamar al método que obtiene el rol

                    // Enrutamiento basado en el rol del usuario
                    if (rolUsuario === 'ADMIN' || rolUsuario === 'ROOT') {
                      this.router.navigate(['/consultar-publicacion']);
                    } else {
                      this.router.navigate(['/mis-publicaciones']);
                    }
                  }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${articuloId}`, error);
                  }
                );
              });
            }, error => {
              Swal.close();  // Cerrar la alerta de carga si hay un error
              Swal.fire('Error', 'Error al registrar el capítulo', 'error');
            });
          },
          error: (error) => {
            console.error('Error al subir el archivo', error);
            Swal.close();  // Cerrar la alerta de carga si hay un error
            Swal.fire('Error', 'Error al subir el archivo', 'error');
          }
        });
      }
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
    // Reiniciar la selección del archivo
    this.fileInput.nativeElement.value = '';
    this.fileName = ''; // Limpia el nombre del archivo en el formulario, si es necesario
  }

  onCheckboxChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this[field] = input.checked;
  }


  onKeyPress(event: KeyboardEvent, field: string): void {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'´]$/.test(char)) {
      // Prevenir la entrada del carácter no permitido.
      event.preventDefault();
    }
  }

  onInput(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    let valor = inputElement.value;
    // Elimina caracteres no permitidos
    valor = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ'´]/g, '');
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if (this.selectedFile.type !== 'application/pdf') {
        Swal.fire('Error', 'Solo se permiten archivos PDF', 'error');
        this.fileName = '';
        return;
      }

      // Actualiza el nombre del archivo
      this.fileName = this.selectedFile.name;

      // Genera el folio
      const trimestreId = this.selectedTrimestre; // El trimestre seleccionado
      const archivoId = this.generateFileId(); // Función para generar un ID único
      const archivoId2 = this.generateFileId(); // Función para generar un ID único
      const folio = `TRIM${trimestreId}-ID${archivoId}${archivoId2}`;

      // Renombra el archivo
      this.renamedFile = new File([this.selectedFile], `${folio}.pdf`, { type: 'application/pdf' });

    }
    console.log(this.renamedFile);
  }

  generateFileId() {
    return Math.floor(Math.random() * 10000); // Esto es solo un ejemplo, puedes personalizarlo
  }

}


