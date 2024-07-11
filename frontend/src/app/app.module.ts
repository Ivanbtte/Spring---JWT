import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { ConsultarInvestigadorComponent } from './forms/ConsultarInvestigador/consultar-investigador/consultar-investigador.component';
import { RegistrarInvestigadorComponent } from './forms/RegistrarInvestigador/registrar-investigador/registrar-investigador.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { CrearUsuarioComponent } from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { JwtInterceptorService } from './services/auth/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';

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
    ConsultarInvestigadorComponent,
    RegistrarInvestigadorComponent,
    RegistrarPublicacionComponent,
    CrearUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptorService,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
