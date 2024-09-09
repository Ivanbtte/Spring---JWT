import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  userLoginOn: boolean = false;
  isOpen: boolean = false; // Cambiar a false para que inicie cerrado

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole();
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });

    // Ejecutar la lógica para establecer el estado inicial del sidebar
    this.applySidebarState();
  }

  // Alternar la visibilidad de la sidebar
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.applySidebarState();
  }

  // Aplicar el estado del sidebar
  applySidebarState(): void {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarItemTitles = document.querySelectorAll('.sidebar-item-title');

    if (this.isOpen) {
      sidebar?.classList.add('expanded');
      mainContent?.classList.add('expanded');
      sidebarItemTitles.forEach(title => title.classList.remove('hide'));
    } else {
      sidebar?.classList.remove('expanded');
      mainContent?.classList.remove('expanded');
      sidebarItemTitles.forEach(title => title.classList.add('hide'));
    }
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
}
