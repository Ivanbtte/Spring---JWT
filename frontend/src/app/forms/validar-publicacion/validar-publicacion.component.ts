import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/services/articulo/articulo';
import { ArticuloService } from 'src/app/services/articulo/articulo.service';
import { Observaciones } from 'src/app/services/articulo/observaciones';
import { LoginService } from 'src/app/services/auth/login.service';
import { FileService } from 'src/app/services/fileService/file.service';
import Swal from 'sweetalert2';


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
        estatus: 2,
        compilado: false
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Rechazo Exitoso',
          text: 'La publicación ha sido rechazada exitosamente',
        }).then(() => {
          this.router.navigate(['/consultar-publicacion']);
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al rechazar',
          text: 'Hubo un problema al rechazar la publicación.',
        });
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: false,
        estatus: 2,
        compilado: false
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Rechazo Exitoso',
          text: 'La publicación ha sido rechazada exitosamente',
        }).then(() => {
          this.router.navigate(['/consultar-publicacion']);
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al rechazar',
          text: 'Hubo un problema al rechazar la publicación.',
        });
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Acción no válida',
        text: 'No tienes permisos para rechazar la publicación.',
      });
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
        estatus: 3,
        compilado: false
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Aceptación Exitosa',
          text: 'La publicación ha sido aceptada exitosamente',
        }).then(() => {
          this.router.navigate(['/consultar-publicacion']);
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al aceptar',
          text: 'Hubo un problema al aceptar la publicación.',
        });
      });
    } else if (this.rolUsuario === 'ADMIN') {
      const observaciones: Observaciones = {
        id_articulo: this.articulo.id_articulo,
        observaciones_directores: this.articulo.observaciones_directores,
        observaciones_gestion: this.articulo.observaciones_gestion,
        aceptado_director: this.articulo.aceptado_director,
        aceptado_gestion: true,
        estatus: 4,
        compilado: true
      };
      this.articuloService.agregarObservaciones(observaciones, this.route.snapshot.paramMap.get('id')).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Aceptación Exitosa',
          text: 'La publicación ha sido aceptada exitosamente',
        }).then(() => {
          this.router.navigate(['/consultar-publicacion']);
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al aceptar',
          text: 'Hubo un problema al aceptar la publicación.',
        });
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Acción no válida',
        text: 'No tienes permisos para aceptar la publicación.',
      });
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
