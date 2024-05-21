import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
errorMessage:string="";
user?:User;

  constructor(private userService:UserService) {
    this.userService.getUser(environment.UserId).subscribe({
      next: (userData) => {
        this.user=userData;
      },
      error:(errorData) =>{
        this.errorMessage=errorData
      },
      complete: () => {
        console.info("User Data ok");
      }
    })
   }

  ngOnInit(): void {
  }

}
