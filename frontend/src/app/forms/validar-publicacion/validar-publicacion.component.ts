import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';

@Component({
  selector: 'app-validar-publicacion',
  templateUrl: './validar-publicacion.component.html',
  styleUrls: ['./validar-publicacion.component.css']
})
export class ValidarPublicacionComponent implements OnInit {


  articulo: any;

  constructor(
    private route: ActivatedRoute,
    private articuloService: ArticuloService) { }

  ngOnInit(): void {
    // Captura el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticuloById(+id).subscribe(
        data => {
          this.articulo = data;
        },
        error => {
          console.error('Error al obtener el artículo:', error);
        }
      );
    }
  }


  rechazarPublicacion() {
    throw new Error('Method not implemented.');
    }
    
    aceptarPublicacion() {
    throw new Error('Method not implemented.');
    }

}
