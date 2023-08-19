import { Component, OnInit } from "@angular/core";
import { UsersService } from "../services/users.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userDetails: any;
  formData: any = {};

  constructor(private userService: UsersService) {}

  ngOnInit() {
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      this.userDetails = JSON.parse(userDetailsString);
    }
  }

  onSubmit() {
    this.userService.addUser(this.formData).subscribe(
      () => {},
      (error) => {
        console.error("Error:", error);
      }
    );
  }
}
