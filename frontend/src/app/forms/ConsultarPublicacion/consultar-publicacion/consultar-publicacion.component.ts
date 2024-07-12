import { Component, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { AutorService } from 'src/app/services/autor/autor.service';
@Component({
  selector: 'app-consultar-publicacion',
  templateUrl: './consultar-publicacion.component.html',
  styleUrls: ['./consultar-publicacion.component.css']
})
export class ConsultarPublicacionComponent implements OnInit {
  selectedInstituto: string | undefined;
  profesores: any[] = [];
  selectedProfesor: string | undefined;
  publicaciones: any[] = [];
  filtrarPorFechas: boolean = false;
  startDate: string = '';
  endDate: string = '';
  articulos: any[] = [];
  institutos = [
    { value: '31', name: 'Instituto de Estudios Municipales' },
    { value: '32', name: 'Instituto de Investigación sobre la Salud Pública' },
    { value: '33', name: 'Instituto de Informática' },
    { value: '34', name: 'Instituto de Nutrición' },
    { value: '35', name: 'Instituto de Estudios Empresariales' },
    ];

  constructor(private articuloService: ArticuloService,private autorService: AutorService) {}

  ngOnInit(): void {
    this.articuloService.getList().subscribe(
      (data: any[]) => {
        this.articulos = data;
      },
      (error: any) => {
        console.error('Error al obtener los artículos:', error);
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