import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/services/articulo/articulo';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Investigador } from 'src/app/services/auth/investigador';
import { LoginService } from 'src/app/services/auth/login.service';
import { AutorService } from 'src/app/services/autor/autor.service';
import { FileService } from 'src/app/services/fileService/file.service';
import { InvestigadorService } from 'src/app/services/investigador/investigador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-articulo',
  templateUrl: './editar-articulo.component.html',
  styleUrls: ['./editar-articulo.component.css']
})
export class EditarArticuloComponent implements OnInit {

  rolUsuario: string | null = '';
  articulo: any;
  selectedFile!: File;
  renamedFile!: File;
  institutos: any[] = [];
  institutosPublicacion: any[] = [];
  investigadores: any[] = []; // Lista de investigadores
  selectedInstitutoPublicacion: any;
  selectedInstitutoAutor: any;
  selectedTrimestre: any;
  autoresPorInstituto: any[][] = [];  // Lista de autores por instituto
  trimestres: any[] = [];
  idsAutores: number[] = []; // Variable para almacenar los IDs de autores UNSIS

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private articuloService: ArticuloService,
    private investigadorService: InvestigadorService,
    private autorService: AutorService,
    private fileService: FileService,
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.rolUsuario = this.loginService.getUserRole();
    this.cdRef.detectChanges(); // Forzar la detección de cambios

    // Captura el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const articuloId = +id;

      // Obtener la lista de institutos
      this.articuloService.getInstitutos().subscribe(
        (institutos: any[]) => {
          this.institutosPublicacion = institutos;

          // Obtener información del artículo
          this.articuloService.getArticuloById(articuloId).subscribe(
            articulo => {
              console.log('Datos del artículo:', articulo);
              this.articulo = articulo;

              // Asignar el instituto afiliado al artículo
              this.selectedInstitutoPublicacion = this.articulo?.instituto?.id || null;
              this.selectedTrimestre = this.articulo?.trimestre?.id_trimestre || null;

              // Formatear la fecha de publicación
              this.articulo.fecha_publicacion = this.formatDateForInput(this.articulo.fecha_publicacion);

              // Cargar los autores asociados al artículo
              this.autorService.getAutorByArticuloById(articuloId).subscribe(
                autores => {
                  // Obtener investigadores y filtrarlos por coincidencia de id_autor
                  this.investigadorService.getInvestigadores().subscribe(
                    (investigadores: any[]) => {

                      // Crear una lista para los autores procesados
                      const autoresProcesados = autores.map((autor: any) => {

                        if (autor.autorUnsis) {
                          // Autor UNSIS: buscar en la lista de investigadores
                          const investigador = investigadores.find((inv: any) => inv.autor.id_autor === autor.id_autor);
                          return {
                            autorUnsis: true,
                            autorUnsisSeleccionado: investigador ? investigador.autor.id_autor : null,
                            instituto: investigador ? investigador.instituto.id : null,
                            primerNombre: '',
                            segundoNombre: '',
                            apellidoPaterno: '',
                            apellidoMaterno: '',
                            agregado: true,
                            id_autor: autor.id_autor,
                            editable: false, // Bloquear campos si es UNSIS
                            mostrarGuardar: false // No mostrar el botón de guardar
                          };
                        } else {
                          // Autor no UNSIS: solo en la lista de autores
                          return {
                            autorUnsis: false,
                            autorUnsisSeleccionado: null,
                            instituto: null,
                            primerNombre: autor.nombre1Autor,
                            segundoNombre: autor.nombre2Autor,
                            apellidoPaterno: autor.apellidoPaternoAutor,
                            apellidoMaterno: autor.apellidoMaternoAutor,
                            agregado: true,
                            id_autor: autor.id_autor,
                            editable: true, // Dejar los campos editables si no es UNSIS
                            mostrarGuardar: true // Mostrar el botón de guardar
                          };
                        }
                      });

                      // Verifica los datos en consola
                      console.log('Autores procesados:', autoresProcesados);

                      // Asignar a la variable que usa el HTML
                      this.investigadores = autoresProcesados;

                      // Pintar correctamente los campos en el HTML
                      this.investigadores.forEach((investigador, index) => {
                        if (investigador.autorUnsis) {
                          this.onInstitutoChange(investigador.instituto, index);
                        }
                      });
                    },
                    (error) => {
                      console.error('Error al obtener los investigadores habilitados:', error);
                    }
                  );
                },
                error => {
                  console.error('Error al obtener los autores:', error);
                }
              );
            },
            error => {
              console.error('Error al obtener el artículo:', error);
            }
          );
        },
        error => {
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

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Devuelve el formato YYYY-MM-DD
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

  tieneDatosCargados(investigador: any): boolean {
    return !!(investigador.primerNombre || investigador.segundoNombre ||
      investigador.apellidoPaterno || investigador.apellidoMaterno ||
      investigador.instituto || investigador.autorUnsisSeleccionado);
  }

  onAutorUnsisChange(investigador: any, index: number): void {
    if (investigador.autorUnsis) {
      // Si el autor es UNSIS, eliminar los valores de los campos de nombre
      investigador.primerNombre = '';
      investigador.segundoNombre = '';
      investigador.apellidoPaterno = '';
      investigador.apellidoMaterno = '';
      investigador.editable = true; // Desbloquear campos cuando se marca como UNSIS
      investigador.autorUnsisSeleccionado = ''; // Limpiar la selección previa de autor
      investigador.instituto = this.selectedInstitutoPublicacion; // Asignar instituto

      // Cargar los autores del instituto seleccionado si ya se ha seleccionado uno
      if (investigador.instituto) {
        this.onInstitutoChange(investigador.instituto, index);
      }
    } else {
      // Si se desmarca como UNSIS, limpiar los campos de selección
      investigador.autorUnsisSeleccionado = null;
      investigador.editable = true; // Desbloquear campos
      investigador.instituto = null;

      // Si el autor fue previamente agregado, eliminamos la marca de agregado para que pueda ser editado
      if (investigador.agregado) {
        this.eliminarInvestigador(index);
      }
    }
  }

  agregarInvestigador() {
    this.investigadores.push({
      primerNombre: '',
      segundoNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      id_autor: null,
      agregado: false, // Indica si el autor ya está guardado
      autorUnsis: false,
      instituto: '',
      autorUnsisSeleccionado: '',
      editable: true, // Los campos estarán desbloqueados por defecto
      mostrarGuardar: true // Mostrar el botón de "Guardar cambios" por defecto
    });
    this.autoresPorInstituto.push([]);
    console.log("Investigadores: ", this.investigadores);
  }

  eliminarInvestigador(index: number) {
    const investigador = this.investigadores[index];
    const idart = Number(this.route.snapshot.paramMap.get('id'));
    // Verificar si el investigador está definido y tiene el campo id_autor
    if (investigador) {
      if (investigador.id_autor) {
        if (investigador.autorUnsisSeleccionado) {
          // Lógica para eliminar un autor UNSIS
          const autorIdIndex = this.idsAutores.indexOf(investigador.autorUnsisSeleccionado);
          if (autorIdIndex !== -1) {
            this.idsAutores.splice(autorIdIndex, 1);
          }
          // Eliminar la relación entre el autor UNSIS y el artículo en la base de datos
          this.autorService.eliminarRelacionAutorUnsis(investigador.id_autor, idart).subscribe(
            response => {
              this.investigadores.splice(index, 1);
              this.autoresPorInstituto.splice(index, 1);
            },
            error => {
              console.error('Error al eliminar la relación de autor UNSIS', error);
            }
          );
        } else {
          // Lógica para eliminar un autor no UNSIS desde la base de datos
          const autorId = investigador.id_autor;
          this.autorService.eliminarAutorNoUnsisRelacionado(autorId, idart).subscribe(
            response => {
              this.investigadores.splice(index, 1);
              this.autoresPorInstituto.splice(index, 1);
              const autorIdIndex = this.idsAutores.indexOf(autorId);
              if (autorIdIndex !== -1) {
                this.idsAutores.splice(autorIdIndex, 1);
              }
            },
            error => {
              console.error('Error al eliminar autor no UNSIS', error);
            }
          );
        }
      } else {
        this.investigadores.splice(index, 1);
        this.autoresPorInstituto.splice(index, 1)
      }
    } else {
      console.error('El investigador no está definido');
    }
    console.info('ID de autores (temporal):', this.idsAutores);
  }

  guardarAutorUnsis(idAutor: number, index: number) {
    const investigador = this.investigadores[index];
    console.log('Instituto seleccionado:', investigador.instituto);
    console.log('ID del autor seleccionado antes:', idAutor);
    // Verificar si el investigador ha seleccionado un autor UNSIS
    if (!investigador.autorUnsisSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un autor UNSIS antes de continuar', 'error');
      return;
    }
    // Extraer el id_autor del objeto autor seleccionado
    idAutor = idAutor;
    console.log('ID del autor seleccionado después:', idAutor);
    // Verificar que el instituto y el autor hayan sido seleccionados
    if (!investigador.instituto || !idAutor) {
      Swal.fire('Error', 'Debe seleccionar un instituto y un autor antes de continuar', 'error');
      return;
    }
    this.idsAutores.push(idAutor);
    investigador.agregado = true;
    investigador.id_autor = idAutor;
    investigador.editable = false;
    investigador.mostrarGuardar = false;

    console.log("ID de autores agregados: ", this.idsAutores);
  }

  agregarAutorNoUnsis(investigador: any, index: number) {
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
        this.idsAutores.push(response.id_autor);
        investigador.agregado = true;
        investigador.editable = false; // Bloquear campos después de guardar
        investigador.mostrarGuardar = false; // Ocultar botón de "Guardar cambios"
        // Lógica adicional si el autor ya existía y fue editado
        console.log("ID de autores: ", this.idsAutores);
      },
      error => {
        console.error('Error al agregar autor no UNSIS:', error);
      }
    );
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

  actualizarAutorNoUnsis(investigador: any, index: number) {
    if (!investigador.primerNombre || !investigador.apellidoPaterno) {
      Swal.fire('Error', 'El primer nombre y el apellido paterno son obligatorios', 'error');
      return;
    }
    const autorActualizado = {
      id_autor: investigador.id_autor,
      nombre1Autor: investigador.primerNombre,
      nombre2Autor: investigador.segundoNombre,
      apellidoPaternoAutor: investigador.apellidoPaterno,
      apellidoMaternoAutor: investigador.apellidoMaterno,
      autorUnsis: false
    };
    this.autorService.actualizarAutorNoUnsis(investigador.id_autor, autorActualizado).subscribe(
      response => {
        console.log('Autor no UNSIS actualizado:', response);
        investigador.editable = false; // Bloquear scampos después de actualizar
        investigador.mostrarGuardar = false; // Ocultar botón de "Guardar cambios"
        Swal.fire('Éxito', 'Autor actualizado correctamente', 'success');
      },
      error => {
        console.error('Error al actualizar autor no UNSIS:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar el autor', 'error');
      }
    );
  }

  validarRegistroAutores(): boolean {
    return this.investigadores.some(investigador => investigador.agregado);
  }

  validarNombre(nombre: string): boolean {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ'´]*$/;
    return regex.test(nombre.trim());
  }

  actualizarArticulo() {
    // Verificar que haya al menos un autor registrado
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de actualizar la publicación.', 'error');
      return;
    }
    console.log("Autores a agregar: ", this.idsAutores);

    const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
    // Verificar si el artículo tiene un archivo seleccionado para actualizar
    if (this.articulo && this.articulo.file) {
      this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
        next: (response) => {
          console.log('Archivo actualizado exitosamente', response);

          this.file = response.id;

          const articulo: Articulo = {
            id_articulo: idarticulo,
            tipoPublicacion: {
              id_publicacion_tipo: 2,
              nombre: 'Capitulo Libro'
            },
            instituto: {
              id: this.selectedInstitutoPublicacion,
              nombre: ''
            },
            trimestre: {
              id_trimestre: this.selectedTrimestre,
              nombre: '',
              fecha_inicio: new Date('2024-05-12'),
              fecha_fin: new Date('2024-08-12')
            },
            fileMetadata: {
              id: this.file,
              fileName: this.articulo.file.name,
              filePath: response.filePath,
              fileType: response.fileType
            },
            fecha_publicacion: this.articulo.fecha_publicacion,
            titulo_revista: this.articulo.titulo_revista,
            numero_revista: this.articulo.numero_revista,
            volumen_revista: this.articulo.volumen_revista,
            pag_inicio: this.articulo.pag_inicio,
            pag_final: this.articulo.pag_final,
            doi: this.articulo.doi,
            nombre_articulo: this.articulo.nombre_articulo,
            indice_miar: this.articulo.indice_miar,
            compilado: this.articulo.compilado,
            financiamiento_prodep: this.articulo.financiamiento_prodep,
            aceptado_director: false,
            aceptado_gestion: false,
            estatus: 1
          };

          this.articuloService.actualizarArticulo(idarticulo, articulo).subscribe({
            next: (response) => {
              Swal.fire('Éxito', 'Artículo actualizado exitosamente', 'success');
              console.log("Autores a agregar: ", this.idsAutores);

              this.idsAutores.forEach((autorId, index) => {
                this.articuloService.agregarAutorArticulo(idarticulo, autorId).subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${idarticulo}`, response);
                    if (index === this.idsAutores.length - 1) {
                      this.limpiarCampos();
                      this.router.navigate(['/inicio']);
                    }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${idarticulo}`, error);
                  }
                );
              });
            },
            error: (error) => {
              console.error('Error al actualizar el artículo', error);
              Swal.fire('Error', 'Error al actualizar el artículo', 'error');
            }
          });
        },
        error: (error) => {
          console.error('Error al actualizar el archivo', error);
          Swal.fire('Error', 'Error al actualizar el archivo', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No hay archivo para actualizar', 'error');
    }
  }

  actualizarCapituloLibro() {
    // Verificar que haya al menos un autor registrado
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de actualizar la publicación.', 'error');
      return;
    }
    console.log("Autores a agregar: ", this.idsAutores);

    const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
    // Verificar si el artículo tiene un archivo seleccionado para actualizar
    if (this.articulo && this.articulo.file) {
      this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
        next: (response) => {
          console.log('Archivo actualizado exitosamente', response);

          this.file = response.id;

          const articulo: Articulo = {
            id_articulo: idarticulo,
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
              fecha_inicio: new Date('2024-05-12'),
              fecha_fin: new Date('2024-08-12')
            },
            fileMetadata: {
              id: this.file,
              fileName: this.articulo.file.name,
              filePath: response.filePath,
              fileType: response.fileType
            },
            fecha_publicacion: this.articulo.fecha_publicacion,
            nombre_capitulo: this.articulo.nombre_capitulo,
            nombre_articulo: this.articulo.nombre_articulo,
            editorial: this.articulo.editorial,
            pag_inicio: this.articulo.pag_inicio,
            pag_final: this.articulo.pag_final,
            isbn_digital: this.articulo.isbn_digital,
            isbn_impreso: this.articulo.isbn_impreso,
            indice_miar: this.articulo.indice_miar,
            compilado: this.articulo.compilado,
            financiamiento_prodep: this.articulo.financiamiento_prodep,
            aceptado_director: false,
            aceptado_gestion: false,
            estatus: 1
          };

          this.articuloService.actualizarArticulo(idarticulo, articulo).subscribe({
            next: (response) => {
              Swal.fire('Éxito', 'Capitulo de libro actualizado exitosamente', 'success');
              console.log("Autores a agregar: ", this.idsAutores);

              this.idsAutores.forEach((autorId, index) => {
                this.articuloService.agregarAutorArticulo(idarticulo, autorId).subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${idarticulo}`, response);
                    if (index === this.idsAutores.length - 1) {
                      this.limpiarCampos();
                      this.router.navigate(['/inicio']);
                    }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${idarticulo}`, error);
                  }
                );
              });
            },
            error: (error) => {
              console.error('Error al actualizar el capitulo de libro', error);
              Swal.fire('Error', 'Error al actualizar el capitulo de libro', 'error');
            }
          });
        },
        error: (error) => {
          console.error('Error al actualizar el archivo', error);
          Swal.fire('Error', 'Error al actualizar el archivo', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No hay archivo para actualizar', 'error');
    }
  }

  actualizarLibro() {
    // Verificar que haya al menos un autor registrado
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de actualizar la publicación.', 'error');
      return;
    }
    console.log("Autores a agregar: ", this.idsAutores);

    const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
    // Verificar si el artículo tiene un archivo seleccionado para actualizar
    if (this.articulo && this.articulo.file) {
      this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
        next: (response) => {
          console.log('Archivo actualizado exitosamente', response);

          this.file = response.id;

          const articulo: Articulo = {
            id_articulo: idarticulo,
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
              fecha_inicio: new Date('2024-05-12'),
              fecha_fin: new Date('2024-08-12')
            },
            fileMetadata: {
              id: this.file,
              fileName: this.articulo.file.name,
              filePath: response.filePath,
              fileType: response.fileType
            },
            fecha_publicacion: this.articulo.fecha_publicacion,
            nombre_articulo: this.articulo.nombre_articulo,
            editorial: this.articulo.editorial,
            isbn_digital: this.articulo.isbn_digital,
            isbn_impreso: this.articulo.isbn_impreso,
            indice_miar: this.articulo.indice_miar,
            compilado: this.articulo.compilado,
            financiamiento_prodep: this.articulo.financiamiento_prodep,
            aceptado_director: false,
            aceptado_gestion: false,
            estatus: 1
          };

          this.articuloService.actualizarArticulo(idarticulo, articulo).subscribe({
            next: (response) => {
              Swal.fire('Éxito', 'Libro actualizado exitosamente', 'success');
              console.log("Autores a agregar: ", this.idsAutores);

              this.idsAutores.forEach((autorId, index) => {
                this.articuloService.agregarAutorArticulo(idarticulo, autorId).subscribe(
                  response => {
                    console.log(`Autor ${autorId} agregado al artículo ${idarticulo}`, response);
                    if (index === this.idsAutores.length - 1) {
                      this.limpiarCampos();
                      this.router.navigate(['/inicio']);
                    }
                  },
                  error => {
                    console.error(`Error al agregar autor ${autorId} al artículo ${idarticulo}`, error);
                  }
                );
              });
            },
            error: (error) => {
              console.error('Error al actualizar el libro', error);
              Swal.fire('Error', 'Error al actualizar el libro', 'error');
            }
          });
        },
        error: (error) => {
          console.error('Error al actualizar el archivo', error);
          Swal.fire('Error', 'Error al actualizar el archivo', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No hay archivo para actualizar', 'error');
    }
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

  cancelar(): void { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Verifica que el archivo sea un PDF
      if (this.selectedFile.type !== 'application/pdf') {
        Swal.fire('Error', 'Solo se permiten archivos PDF', 'error');
        return;
      }
      // Genera el folio
      const trimestreId = this.selectedTrimestre; // El trimestre seleccionado
      const archivoId = this.generateFileId(); // Función para generar un ID único
      const archivoId2 = this.generateFileId(); // Función para generar un ID único
      const folio = `TRIM${trimestreId}-ID${archivoId}${archivoId2}`;
      // Renombra el archivo
      this.renamedFile = new File([this.selectedFile], `${folio}.pdf`, { type: 'application/pdf' });
      // Asigna el archivo renombrado a this.articulo.file
      this.articulo.file = this.renamedFile;
    }
    console.log(this.renamedFile);
  }

  generateFileId() {
    return Math.floor(Math.random() * 10000); // Esto es solo un ejemplo, puedes personalizarlo
  }

}
