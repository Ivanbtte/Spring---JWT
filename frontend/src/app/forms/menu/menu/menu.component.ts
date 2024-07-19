import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userRole: string = '';

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.userRole = this.loginService.getUserRole();
  }
}