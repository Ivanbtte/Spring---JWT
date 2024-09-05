import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsultarPublicacionComponent } from './forms/ConsultarPublicacion/consultar-publicacion/consultar-publicacion.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { CrearUsuarioComponent } from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { EditarUsuarioComponent } from './forms/formsEdit/editar-usuario/editar-usuario.component';
import { EditarInvestigadorComponent } from './forms/formsEdit/editar-investigador/editar-investigador.component';
import { EditarArticuloComponent } from './forms/formsEdit/editar-articulo/editar-articulo.component';
import { InvestigadorComponent } from './forms/investigador/investigador.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized/not-authorized.component';
import { RutasGuard } from './auth/rutas.guard';
import { CatalogoComponent } from './forms/catalogo/catalogo/catalogo.component';
import { RegistrarCatalogoComponent } from './forms/RegistrarCatalogo/registrar-catalogo/registrar-catalogo.component';
import { UploadFilesComponent } from './forms/upload-files/upload-files.component';
import { ValidarPublicacionComponent } from './forms/validar-publicacion/validar-publicacion.component';
import { MisPublicacionesComponent } from './forms/misPublicaciones/mis-publicaciones/mis-publicaciones.component';
import { CambiarContraComponent } from './forms/cambiarContra/cambiar-contra/cambiar-contra.component';

const routes: Routes = [
  { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' },
  { path: 'inicio', component: DashboardComponent },
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'consultar-publicacion', component: ConsultarPublicacionComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'registrar-publicacion', component: RegistrarPublicacionComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'ADMIN'] } },
  { path: 'usuario', component: UsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'investigador', component: InvestigadorComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'ADMIN'] } },
  { path: 'editar-usuario/:id', component: EditarUsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'editar-investigador/:id', component: EditarInvestigadorComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'ADMIN'] } },
  { path: 'editar-articulo/:id', component: EditarArticuloComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'INVESTIGADOR'] } },
  { path: 'no-authorized', component: NotAuthorizedComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'registrar-catalogo', component: RegistrarCatalogoComponent },
  { path: 'upload', component: UploadFilesComponent },
  { path: 'validar-publicacion/:id', component: ValidarPublicacionComponent },
  { path: 'mis-publicaciones', component: MisPublicacionesComponent},
  { path: 'cmbc', component: CambiarContraComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
