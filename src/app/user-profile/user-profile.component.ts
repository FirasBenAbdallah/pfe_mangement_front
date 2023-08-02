import { Component, OnInit } from '@angular/core';
import { UsersService } from "../services/users.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  formData: any = {};

  constructor(private userService: UsersService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.formData);

    this.userService.addUser(this.formData).subscribe(
      (response) => {
        console.log("Success:", response);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
}
