import { Component, inject, OnInit } from '@angular/core';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';

@Component({
  selector: 'app-consultar-investigador',
  templateUrl: './consultar-investigador.component.html',
  styleUrls: ['./consultar-investigador.component.css']
})
export class ConsultarInvestigadorComponent implements OnInit {
  articulos: any[] = [];

  constructor(private articuloService: ArticuloService) {}

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

  trackById(index: number, articulo: any): number {
    return articulo.id;
  }
}