import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/services/articulo/articulo';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Observaciones } from 'src/app/services/articulo/observaciones';
import { LoginService } from 'src/app/services/auth/login.service';
import { FileService } from 'src/app/services/fileService/file.service';

@Component({
  selector: 'app-validar-publicacion',
  templateUrl: './validar-publicacion.component.html',
  styleUrls: ['./validar-publicacion.component.css']
})
export class ValidarPublicacionComponent implements OnInit {


  rolUsuario: string | null = '';
  articulo: any;

  constructor(
    private route: ActivatedRoute,
    private articuloService: ArticuloService,
    private loginService: LoginService,
    private fileService: FileService,
    private router: Router) { }

  ngOnInit(): void {
    this.rolUsuario = this.loginService.getUserRole();
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

  editarPublicacion(articulo: Articulo): void {
    console.log("Llevando a editar : ", articulo.id_articulo);
    this.router.navigate(['/editar-articulo/', articulo.id_articulo]);
  }

  rechazarPublicacion() {
    if (this.rolUsuario === 'COORDINADOR') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: false,
        aceptado_gestion: this.articulo.aceptado_gestion,
        estatus: 2
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: true,
        estatus: 4
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else {
      // Acción por defecto o para otros roles (si aplica)
      console.log('Acción para otros roles');
    }
  }

  aceptarPublicacion() {
    if (this.rolUsuario === 'COORDINADOR') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: true,
        aceptado_gestion: this.articulo.aceptado_gestion,
        estatus: 3
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: true,
        estatus: 4
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else {
      // Acción por defecto o para otros roles (si aplica)
      console.log('Acción para otros roles');
    }
  }

  descargarPublicacion(fileId: string) {
    const id = +fileId; // Convertir el string a número
    this.fileService.downloadFile(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.articulo.fileMetadata.fileName;
      a.click();
    });
  }

}
