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

          if (this.rolUsuario === 'COORDINADOR') {
            // Verifica si el estatus del artículo es 2 o 4 y asigna true a mostrarObservaciones
            if (this.articulo.estatus === 2 || this.articulo.estatus === 4 || this.articulo.estatus === 3) {
              this.mostrarObservaciones = true;
            } else {
              this.mostrarObservaciones = false;
            }
          }
          if (this.rolUsuario === 'ADMIN') {
            // Verifica si el estatus del artículo es 2 o 4 y asigna true a mostrarObservaciones
            if (this.articulo.estatus === 2 || this.articulo.estatus === 4) {
              this.mostrarObservaciones = true;
            } else {
              this.mostrarObservaciones = false;
            }
          }
        },
        error => {
          console.error('Error al obtener el artículo:', error);
        }
      );
    }
  }

  editarPublicacion(articulo: Articulo): void {
    this.router.navigate(['/editar-articulo/', articulo.id_articulo]);
  }

  mostrarObservaciones: boolean = false; // Variable para controlar la visibilidad del campo

  // Método para mostrar el campo de observaciones
  toggleObservaciones() {
    this.mostrarObservaciones = !this.mostrarObservaciones;
  }

  rechazarPublicacion() {
    if (this.rolUsuario === 'COORDINADOR') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        observaciones_investigador: this.articulo.observaciones_investigador,
        aceptado_director: false,
        aceptado_gestion: this.articulo.aceptado_gestion,
        estatus: 2,
        compilado: this.articulo.compilado
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
        // Redirigir a /mis-publicaciones si el rol es COORDINADOR
        this.router.navigate(['/mis-publicaciones']);
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        observaciones_investigador: this.articulo.observaciones_investigador,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: false,
        estatus: 2,
        compilado: this.articulo.compilado
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
      }, error => {
        console.error('Error al Editar el artículo', error);
        // Redirigir a /consultar-publicaciones si el rol es ADMIN
        this.router.navigate(['/consultar-publicacion']);
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
        observaciones_investigador: this.articulo.observaciones_investigador,
        aceptado_director: true,
        aceptado_gestion: this.articulo.aceptado_gestion,
        estatus: 3,
        compilado: this.articulo.compilado
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
        // Redirigir a /mis-publicaciones si el rol es COORDINADOR
        this.router.navigate(['/mis-publicaciones']);
      }, error => {
        console.error('Error al Editar el artículo', error);
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        observaciones_investigador: this.articulo.observaciones_investigador,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: true,
        estatus: 4,
        compilado: this.articulo.compilado
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        console.log('Artículo Editado exitosamente');
        // Redirigir a /consultar-publicaciones si el rol es ADMIN
        this.router.navigate(['/consultar-publicacion']);
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

  cancelarAdmin() {
    this.router.navigate(['/consultar-publicacion']); // Ajusta la ruta según tu aplicación
  }

  cancelarInves() {
    this.router.navigate(['/mis-publicaciones']); // Ajusta la ruta según tu aplicación
  }

}
