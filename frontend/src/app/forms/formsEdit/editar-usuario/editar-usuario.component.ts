import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  user: User = {
    id: 0, username: '', role: '',
    enabled: false
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUser(+id).subscribe(
        (data: User) => {
          this.user = data;
        },
        (error: any) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }

  onSave(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      (data: User) => {
        this.router.navigate(['/usuarios']);
      },
      (error: any) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
}