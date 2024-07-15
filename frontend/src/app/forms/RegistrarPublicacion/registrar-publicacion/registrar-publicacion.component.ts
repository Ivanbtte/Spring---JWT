import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar-publicacion',
  templateUrl: './registrar-publicacion.component.html',
  styleUrls: ['./registrar-publicacion.component.css']
})
export class RegistrarPublicacionComponent implements OnInit {
  volumen: any;
  emision: any;
  paginas: any;

  constructor() { }

  ngOnInit(): void {
  }

  tiposPublicacion: string[] = [
    'Artículo', 'Artículo en revista indexada', 'Artículo en revista online', 'Capítulo de libro', 'Libro'
  ];
  rolesColaboradores: string[] = ['Autor', 'Traductor', 'Editor'];

  tipoPublicacion: string = '';
  titulo: string = '';
  nombreRevista: string = '';
  colaboradores: any[] = [];
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

  agregarColaborador() {
    this.colaboradores.push({ primerNombre: '', apellido: '', rol: 'Autor' });
  }

  eliminarColaborador(index: number) {
    this.colaboradores.splice(index, 1);
  }

  agregarPublicacion() {
    // Lógica para agregar la publicación
    console.log('Publicación agregada:', {
      tipoPublicacion: this.tipoPublicacion,
      titulo: this.titulo,
      nombreRevista: this.nombreRevista,
      colaboradores: this.colaboradores,
      volumen: this.volumen,
      emision: this.emision,
      numArticulo: this.numArticulo,
      estadoPublicacion: this.tipoPublicacion,
      fechaPublicacion: this.fechaPublicacion,
      paginas: this.paginas,
      doi: this.doi,

      // Datos para Libro
      tituloLibro: this.tituloLibro,
      lugarPublicacion: this.lugarPublicacion,
      editorial: this.editorial,
      fechaPublicacionLibro: this.fechaPublicacionLibro,
      isbn: this.isbn,
      url: this.url,

      // Datos para Capítulo de Libro
      tituloCapitulo: this.tituloCapitulo,
      nombreLibro: this.nombreLibro,
      edicionLibro: this.edicionLibro,
      paginaInicial: this.paginaInicial,
      paginaFinal: this.paginaFinal,
      fechaPublicacionCapitulo: this.fechaPublicacionCapitulo,
      editorialCapitulo: this.editorialCapitulo,
      isbnCapitulo: this.isbnCapitulo,
      urlCapitulo: this.urlCapitulo,

      // Datos para Capítulo en Revista Indexada
      tituloRevista: this.tituloRevista, // NUEVO
      volumenRevista: this.volumenRevista, // NUEVO
      numeroRevista: this.numeroRevista, // NUEVO
      paginaInicioRevista: this.paginaInicioRevista, // NUEVO
      paginaFinRevista: this.paginaFinRevista, // NUEVO
      issnImpreso: this.issnImpreso, // NUEVO
      issnOnline: this.issnOnline // NUEVO
    });
  }
}
