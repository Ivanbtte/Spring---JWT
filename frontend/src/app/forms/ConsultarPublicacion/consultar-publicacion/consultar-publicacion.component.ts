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
  filtrarPorProfesor: boolean = false;
  filtrarPorFechas: boolean = false;
  selectedInstituto: string | undefined;
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
}