import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
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
    RegistrarPublicacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
