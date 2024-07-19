import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsultarPublicacionComponent } from './forms/ConsultarPublicacion/consultar-publicacion/consultar-publicacion.component';
import { RegistrarInvestigadorComponent } from './forms/RegistrarInvestigador/registrar-investigador/registrar-investigador.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { CrearUsuarioComponent} from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { EditarUsuarioComponent } from './forms/formsEdit/editar-usuario/editar-usuario.component';
import { InvestigadorComponent } from './forms/investigador/investigador.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized/not-authorized.component';
import { RutasGuard } from './auth/rutas.guard';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: DashboardComponent },
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'consultar-publicacion', component: ConsultarPublicacionComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'registrar-investigador', component: RegistrarInvestigadorComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'ADMIN'] } },
  { path: 'registrar-publicacion', component: RegistrarPublicacionComponent, canActivate: [RutasGuard], data: { expectedRoles: ['INVESTIGADOR', 'ROOT', 'ADMIN', 'COORDINADOR'] } },
  { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT', 'ADMIN'] } },
  { path: 'usuario', component: UsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'investigador', component: InvestigadorComponent, canActivate: [RutasGuard], data: { expectedRoles:  ['ROOT', 'ADMIN'] } },
  { path: 'editar-usuario/:id', component: EditarUsuarioComponent, canActivate: [RutasGuard], data: { expectedRoles: ['ROOT'] } },
  { path: 'no-authorized', component: NotAuthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
