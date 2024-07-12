import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsultarPublicacionComponent } from './forms/ConsultarPublicacion/consultar-publicacion/consultar-publicacion.component';
import { RegistrarInvestigadorComponent } from './forms/RegistrarInvestigador/registrar-investigador/registrar-investigador.component';
import { RegistrarPublicacionComponent } from './forms/RegistrarPublicacion/registrar-publicacion/registrar-publicacion.component';
import { CrearUsuarioComponent} from './forms/CrearUsuario/crear-usuario/crear-usuario.component';
import { UsuarioComponent } from './forms/usuario/usuario.component';
import { InvestigadorComponent } from './forms/investigador/investigador.component';


const routes: Routes = [
  {path:'',redirectTo:'/inicio', pathMatch:'full'},
  {path:'inicio',component:DashboardComponent},
  {path:'iniciar-sesion',component:LoginComponent},
  {path:'consultar-publicacion', component: ConsultarPublicacionComponent },
  {path:'registrar-investigador', component: RegistrarInvestigadorComponent },
  {path:'registrar-publicacion', component: RegistrarPublicacionComponent },
  {path:'crear-usuario',component: CrearUsuarioComponent},
  {path:'usuario', component:UsuarioComponent},
  {path:'investigador', component:InvestigadorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
