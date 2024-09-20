import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RutasGuard } from './auth/rutas.guard';
import { CambiarContraComponent } from './forms/cambiarContra/cambiar-contra/cambiar-contra.component';
import { CatalogoComponent } from './forms/catalogo/catalogo/catalogo.component';
import { ConsultarPublicacionComponent } from './forms/ConsultarPublicacion/consultar-publicacion/consultar-publicacion.component';
import { CrearUsuarioComponent } from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { EditarArticuloComponent } from './forms/formsEdit/editar-articulo/editar-articulo.component';
import { EditarInstitutoComponent } from './forms/formsEdit/editar-instituto/editar-instituto.component';
import { EditarInvestigadorComponent } from './forms/formsEdit/editar-investigador/editar-investigador.component';
import { EditarTrimestreComponent } from './forms/formsEdit/editar-trimestre/editar-trimestre.component';
import { EditarUsuarioComponent } from './forms/formsEdit/editar-usuario/editar-usuario.component';
import { InvestigadorComponent } from './forms/investigador/investigador.component';
import { MisPublicacionesComponent } from './forms/misPublicaciones/mis-publicaciones/mis-publicaciones.component';
import { RegistrarCatalogoComponent } from './forms/RegistrarCatalogo/registrar-catalogo/registrar-catalogo.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { ValidarPublicacionComponent } from './forms/validar-publicacion/validar-publicacion.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized/not-authorized.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
  { path: 'no-authorized', component: NotAuthorizedComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'registrar-catalogo', component: RegistrarCatalogoComponent, canActivate: [RutasGuard], data: { expectedRoles: [ 'ROOT'] } },
  { path: 'validar-publicacion/:id', component: ValidarPublicacionComponent, canActivate: [RutasGuard], data: { expectedRoles: [ 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'mis-publicaciones', component: MisPublicacionesComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR','COORDINADOR'] }},
  { path: 'cmbc', component: CambiarContraComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] }},
  { path: 'editar-trimestre/:id', component: EditarTrimestreComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'editar-instituto/:id', component: EditarInstitutoComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'no-authorized', component: NotAuthorizedComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'registrar-catalogo', component: RegistrarCatalogoComponent },
  { path: 'validar-publicacion/:id', component: ValidarPublicacionComponent },
  { path: 'mis-publicaciones', component: MisPublicacionesComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
