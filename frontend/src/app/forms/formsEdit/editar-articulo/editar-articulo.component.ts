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
                            rol: autor.rol_autor || 'Autor', // Asignar el rol del autor
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
                            rol: autor.rol_autor || 'Autor', // Asignar el rol del autor
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
                    }
                  );
                },
                error => {
                }
              );
            },
            error => {
            }
          );
        },
        error => {
        }
      );

      // Llama al método para obtener los trimestres cuando se inicializa el componente
      this.articuloService.getTrimestres().subscribe(
        (data: any[]) => {
          this.trimestres = data;
        },
        (error) => {
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
    date.setDate(date.getDate() - 1); // Resta 1 día
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
    // Verificar si el investigador ha seleccionado un autor UNSIS
    if (!investigador.autorUnsisSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un autor UNSIS antes de continuar', 'error');
      return;
    }
    // Extraer el id_autor del objeto autor seleccionado
    idAutor = idAutor;
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
        investigador.id_autor = response.id_autor;
        this.idsAutores.push(response.id_autor);
        investigador.agregado = true;
        investigador.editable = false; // Bloquear campos después de guardar
        investigador.mostrarGuardar = false; // Ocultar botón de "Guardar cambios"
        // Lógica adicional si el autor ya existía y fue editado
      },
      error => {
        console.error('Error al agregar autor no UNSIS:', error);
      }
    );
  }

  validarCampos(): boolean {
    // Validar campos obligatorios
    if (!this.articulo.nombre_articulo.trim()) {
      Swal.fire('Error', 'El título del artículo es obligatorio', 'error');
      return false;
    }
    if (!this.articulo.titulo_revista.trim()) {
      Swal.fire('Error', 'El nombre de la revista es obligatorio', 'error');
      return false;
    }
    if (!this.selectedInstitutoPublicacion) {
      Swal.fire('Error', 'El instituto de afiliación es obligatorio', 'error');
      return false;
    }
    if (!this.articulo.fecha_publicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria', 'error');
      return false;
    }
    if (!this.selectedTrimestre) {
      Swal.fire('Error', 'El trimestre es obligatorio', 'error');
      return false;
    }
    const numVolumen = Number(this.articulo.volumen_revista);
    if (numVolumen <= 0 || !Number.isInteger(numVolumen)) {
      Swal.fire('Error', 'El número de volumen debe ser un número positivo', 'error');
      return false;
    }
    if (!this.articulo.numero_revista || this.articulo.numero_revista <= 0) {
      Swal.fire('Error', 'El número de emisión debe ser un número positivo', 'error');
      return false;
    }
    if (!this.articulo.pag_inicio || this.articulo.pag_inicio <= 0) {
      Swal.fire('Error', 'La página de inicio debe ser un número positivo', 'error');
      return false;
    }
    if (!this.articulo.pag_final || this.articulo.pag_final <= this.articulo.pag_inicio) {
      Swal.fire('Error', 'La página final debe ser mayor a la página de inicio', 'error');
      return false;
    }
    if (!this.articulo.doi.trim()) {
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
  

  ValidarLibro(): boolean {
    // Validar campos obligatorios
    if (!this.articulo.nombre_articulo || !this.articulo.nombre_articulo.trim()) {
      Swal.fire('Error', 'El título del libro es obligatorio', 'error');
      return false;
    }
  
    if (!this.articulo.editorial || !this.articulo.editorial.trim()) {
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
  
    if (!this.articulo.fecha_publicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria', 'error');
      return false;
    }
  
    // Validar que al menos uno de los ISBN esté presente
    if (!this.articulo.isbn_impreso && !this.articulo.isbn_digital) {
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
    if (!this.articulo.nombre_capitulo) {
      Swal.fire('Error', 'El título del capítulo es obligatorio.', 'error');
      return false;
    }
    if (!this.articulo.nombre_articulo) {
      Swal.fire('Error', 'El título del libro es obligatorio.', 'error');
      return false;
    }
    if (!this.articulo.editorial) {
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
    if (!this.articulo.fecha_publicacion) {
      Swal.fire('Error', 'La fecha de publicación es obligatoria.', 'error');
      return false;
    }
    if (this.articulo.pag_final < this.articulo.pag_inicio) {
      Swal.fire('Error', 'La página final debe ser mayor o igual a la página de inicio.', 'error');
      return false;
    }
    if (!this.articulo.isbn_impreso && !this.articulo.isbn_digital) {
      Swal.fire('Error', 'Debes proporcionar al menos un ISBN (impreso o digital).', 'error');
      return false;
    }
    if (!this.renamedFile) {
      Swal.fire('Error', 'Debe subir su evidencia en PDF antes de registrar la publicación', 'error');
      return false;
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
    if (!this.validarCampos()) {
      return;
    }

    // Confirmar si desea continuar con la actualización
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de actualizar el Artículo. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
        const fechAjustada = this.articulo.fecha_publicacion ? new Date(this.articulo.fecha_publicacion) : new Date();
        fechAjustada.setDate(fechAjustada.getDate() + 1);

        // Función para crear el objeto artículo
        const crearArticulo = (fileMetadata: any) => {
          return {
            id_articulo: idarticulo,
            tipoPublicacion: {
              id_publicacion_tipo: 1,
              nombre: 'Articulo'
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
              id: fileMetadata.id,
              fileName: fileMetadata.fileName,
              filePath: fileMetadata.filePath,
              fileType: fileMetadata.fileType
            },
            fecha_publicacion: fechAjustada,
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
        };

        // Actualizar artículo en base a la existencia de un archivo
        const actualizarArticuloConAutores = (fileMetadata: any) => {
          const articulo = crearArticulo(fileMetadata);
          this.articuloService.actualizarArticulo(idarticulo, articulo).subscribe({
            next: () => {
              // Actualizamos los autores después del artículo
              let autoresActualizados = this.idsAutores.map((autorId, index) => {
                return this.articuloService.agregarAutorArticulo(idarticulo, autorId, "Autor").toPromise(); // Convertimos las llamadas a promesas
              });

              // Cuando todas las promesas se resuelvan, redirigimos
              Promise.all(autoresActualizados)
                .then(() => {
                  Swal.fire('Éxito', 'Artículo y autores actualizados exitosamente', 'success');
                  this.limpiarCampos();
                  this.router.navigate(['/consultar-publicacion']); // Redirigir después de actualizar todo
                })
                .catch((error) => {
                  console.error('Error al agregar los autores', error);
                  Swal.fire('Error', 'Error al actualizar los autores', 'error');
                });
            },
            error: (error) => {
              console.error('Error al actualizar el artículo', error);
              Swal.fire('Error', 'Error al actualizar el artículo', 'error');
            }
          });
        };

        // Si hay un archivo seleccionado, lo actualizamos
        if (this.articulo && this.articulo.file) {
          this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
            next: (response) => {
              actualizarArticuloConAutores(response); // Llamamos a la función con el nuevo archivo
            },
            error: (error) => {
              console.error('Error al actualizar el archivo', error);
              Swal.fire('Error', 'Error al actualizar el archivo', 'error');
            }
          });
        } else {
          // Si no hay archivo, conservamos los metadatos existentes
          actualizarArticuloConAutores(this.articulo.fileMetadata);
        }
      }
    });
  }

  actualizarCapituloLibro() {

    // Verificar que haya al menos un autor registrado
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de actualizar la publicación.', 'error');
      return;
    }

    // Confirmar si desea continuar con la actualización
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de actualizar el capítulo de libro. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
        const fechAjustada = this.articulo.fecha_publicacion ? new Date(this.articulo.fecha_publicacion) : new Date();
        fechAjustada.setDate(fechAjustada.getDate() + 1);

        // Función para crear el objeto del capítulo de libro
        const crearCapitulo = (fileMetadata: any) => {
          return {
            id_articulo: idarticulo,
            tipoPublicacion: {
              id_publicacion_tipo: 2,
              nombre: 'Capítulo de libro'
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
            fileMetadata: fileMetadata,
            fecha_publicacion: fechAjustada,
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
        };

        // Función para actualizar el capítulo de libro con los autores
        const actualizarCapituloConAutores = (fileMetadata: any) => {
          const articulo = crearCapitulo(fileMetadata);
          this.articuloService.actualizarArticulo(idarticulo, articulo).subscribe({
            next: () => {
              // Actualizamos los autores después del artículo
              let autoresActualizados = this.idsAutores.map((autorId, index) => {
                const investigador = this.investigadores[index]; // Obtener el investigador correspondiente
                return this.articuloService.agregarAutorArticulo(idarticulo, autorId, investigador.rol).toPromise(); // Convertimos las llamadas a promesas
              });

              // Cuando todas las promesas se resuelvan, redirigimos
              Promise.all(autoresActualizados)
                .then(() => {
                  Swal.fire('Éxito', 'Capítulo de libro y autores actualizados exitosamente', 'success');
                  this.limpiarCampos();
                  this.router.navigate(['/consultar-publicacion']); // Redirigir después de actualizar todo
                })
                .catch((error) => {
                  console.error('Error al agregar los autores', error);
                  Swal.fire('Error', 'Error al actualizar los autores', 'error');
                });
            },
            error: (error) => {
              console.error('Error al actualizar el capítulo de libro', error);
              Swal.fire('Error', 'Error al actualizar el capítulo de libro', 'error');
            }
          });
        };

        // Si hay un archivo seleccionado, lo actualizamos
        if (this.articulo && this.articulo.file) {
          this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
            next: (response) => {
              actualizarCapituloConAutores(response); // Llamamos a la función con el nuevo archivo
            },
            error: (error) => {
              console.error('Error al actualizar el archivo', error);
              Swal.fire('Error', 'Error al actualizar el archivo', 'error');
            }
          });
        } else {
          // Si no hay archivo, conservamos los metadatos existentes
          actualizarCapituloConAutores(this.articulo.fileMetadata);
        }
      }
    });
  }

  actualizarLibro() {

    // Verificar que haya al menos un autor registrado
    if (!this.validarRegistroAutores()) {
      Swal.fire('Error', 'Debe registrar al menos un autor antes de actualizar la publicación.', 'error');
      return;
    }

    // Confirmar si desea continuar con la actualización
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de actualizar el libro. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const idarticulo = Number(this.route.snapshot.paramMap.get('id'));
        const fechAjustada = this.articulo.fecha_publicacion ? new Date(this.articulo.fecha_publicacion) : new Date();
        fechAjustada.setDate(fechAjustada.getDate() + 1);

        // Función para actualizar el libro con los metadatos del archivo
        const actualizarArticulo = (fileMetadata: any) => {
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
            fileMetadata: fileMetadata,
            fecha_publicacion: fechAjustada,
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
            next: () => {
              Swal.fire('Éxito', 'Libro actualizado exitosamente', 'success');

              // Actualizar los autores
              const actualizarAutores = this.idsAutores.map((autorId, index) => {
                return this.articuloService.agregarAutorArticulo(idarticulo, autorId, "Autor").toPromise(); // Convertimos las llamadas a promesas
              });

              // Esperar a que todas las promesas se resuelvan
              Promise.all(actualizarAutores)
                .then(() => {
                  this.limpiarCampos();
                  this.router.navigate(['/consultar-publicacion']); // Redirigir después de actualizar todo
                })
                .catch((error) => {
                  console.error('Error al agregar los autores', error);
                  Swal.fire('Error', 'Error al actualizar los autores', 'error');
                });
            },
            error: (error) => {
              console.error('Error al actualizar el libro', error);
              Swal.fire('Error', 'Error al actualizar el libro', 'error');
            }
          });
        };

        // Verificar si el libro tiene un archivo seleccionado para actualizar
        if (this.articulo && this.articulo.file) {
          this.fileService.updateFile(this.articulo.fileMetadata.id, this.articulo.file).subscribe({
            next: (response) => {
              const fileMetadata = {
                id: response.id,
                fileName: this.articulo.file.name,
                filePath: response.filePath,
                fileType: response.fileType
              };
              actualizarArticulo(fileMetadata); // Actualizar el libro con el nuevo archivo
            },
            error: (error) => {
              console.error('Error al actualizar el archivo', error);
              Swal.fire('Error', 'Error al actualizar el archivo', 'error');
            }
          });
        } else {
          // Si no hay archivo seleccionado, usar los metadatos existentes
          actualizarArticulo(this.articulo.fileMetadata);
        }
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
  }

  cancelar(): void {
    this.router.navigate(['/consultar-publicacion']);
  }

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
    //    this[field] = valor;
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
