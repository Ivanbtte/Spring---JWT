import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { AutorService } from 'src/app/services/autor/autor.service';
import { InstitutoService } from 'src/app/services/instituto/instituto.service';
@Component({
  selector: 'app-consultar-publicacion',
  templateUrl: './consultar-publicacion.component.html',
  styleUrls: ['./consultar-publicacion.component.css']
})
export class ConsultarPublicacionComponent implements OnInit {
  filtrarPorInstituto: boolean = false;
  filtrarPorPublicación: boolean = false;
  filtrarPorProfesor: boolean = false;
  filtrarPorFechas: boolean = false;
  filtrarPorTipo: boolean = false;
  selectedInstituto: string | undefined;
  selectedPublicacion: string | undefined;
  publicacion:any[]=[];
  profesores: any[] = [];
  selectedProfesor: string | undefined;
  publicaciones: any[] = [];
  startDate: string = '';
  endDate: string = '';
  articulos: any[] = [];
  institutos: any[] = [];

  constructor(
    private articuloService: ArticuloService,
    private autorService: AutorService,
    private institutoService: InstitutoService
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
  }

  report(){
    this.articuloService.reporte().subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading the file', error);
    });
  }

  searchPublications(): void {
    const searchCriteria = {
      instituto: this.selectedInstituto,
    };

    this.articuloService.searchPublications(searchCriteria).subscribe(data => {
      this.publicaciones = data;
    });
  }

  trackById(index: number, articulo: any): number {
    return articulo.id;
  }

  editarArticulo(articulo: any) {
    // Lógica para editar el artículo, por ejemplo redirigir a una página de edición.
    console.log('Editar artículo:', articulo);
  }

  darDeBajaArticulo(articulo: any) {
    // Lógica para dar de baja el artículo, por ejemplo mostrar un mensaje de confirmación.
    console.log('Dar de baja artículo:', articulo);
  }
}