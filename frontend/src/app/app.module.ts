import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { CambiarContraComponent } from './forms/cambiarContra/cambiar-contra/cambiar-contra.component';
import { CatalogoComponent } from './forms/catalogo/catalogo/catalogo.component';
import { ConsultarPublicacionComponent } from './forms/ConsultarPublicacion/consultar-publicacion/consultar-publicacion.component';
import { CrearUsuarioComponent } from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { EditarArticuloComponent } from './forms/formsEdit/editar-articulo/editar-articulo.component';
import { EditarInvestigadorComponent } from './forms/formsEdit/editar-investigador/editar-investigador.component';
import { EditarUsuarioComponent } from './forms/formsEdit/editar-usuario/editar-usuario.component';
import { InvestigadorComponent } from './forms/investigador/investigador.component';
import { MenuComponent } from './forms/menu/menu/menu.component';
import { MisPublicacionesComponent } from './forms/misPublicaciones/mis-publicaciones/mis-publicaciones.component';
import { RegistrarCatalogoComponent } from './forms/RegistrarCatalogo/registrar-catalogo/registrar-catalogo.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { ValidarPublicacionComponent } from './forms/validar-publicacion/validar-publicacion.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized/not-authorized.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';
import { JwtInterceptorService } from './services/auth/jwt-interceptor.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    PersonalDetailsComponent,
    UsuarioComponent,
    RegistrarPublicacionComponent,
    CrearUsuarioComponent,
    ConsultarPublicacionComponent,
    MenuComponent,
    InvestigadorComponent,
    EditarUsuarioComponent,
    EditarArticuloComponent,
    EditarInvestigadorComponent,
    NotAuthorizedComponent,
    CatalogoComponent,
    RegistrarCatalogoComponent,
    ValidarPublicacionComponent,
    MisPublicacionesComponent,
    SidebarComponent,
    CambiarContraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptorService,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
