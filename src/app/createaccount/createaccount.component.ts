import { Component, OnInit } from "@angular/core";
import { UsersService } from "../services/users.service";

@Component({
  selector: "app-createaccount",
  templateUrl: "./createaccount.component.html",
  styleUrls: ["./createaccount.component.css"],
})
export class CreateaccountComponent implements OnInit {
  ngOnInit(): void {}

  formData: any = {}; // Replace with your desired form data structure

  constructor(private userService: UsersService) {}

  onSubmit() {
    this.userService.addUser(this.formData).subscribe(
      (response) => {},
      (error) => {
        console.error("Error:", error);
      }
    );
  }
}
