import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  FormCrear() {
    this.router.navigate(['/crear-usuario']);
  }

  FormEditar(user: User): void {
    console.log("Llevando a editar : ", user.id);
    this.router.navigate(['/editar-usuario/', user.id]);
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'INVESTIGADOR':
        return 'Investigador';
      case 'COORDINADOR':
        return 'Director';
      default:
        return 'Desconocido';
    }
  }

  onEdit(user: User): void {
    const updatedUser: User = { ...user, username: 'usuarioActualizado' };
    this.userService.updateUser(user.id, updatedUser).subscribe(
      (data: User) => {
        const index = this.users.findIndex(u => u.id === data.id);
        if (index !== -1) {
          this.users[index] = data;
        }
      },
      (error: any) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  onDisable(user: User): void {
    this.userService.disableUser(user.id).subscribe(
      () => {
        console.log('Usuario deshabilitado con éxito');
        this.loadUsers(); // Recargar la lista de usuarios
      },
      (error: any) => {
        console.error('Error al deshabilitar el usuario:', error);
      }
    );
  }

  onEnable(user: User): void {
    this.userService.enableUser(user.id).subscribe(
      () => {
        console.log('Usuario habilitado con éxito');
        this.loadUsers(); // Recargar la lista de usuarios
      },
      (error: any) => {
        console.error('Error al habilitar el usuario:', error);
      }
    );
  }
}