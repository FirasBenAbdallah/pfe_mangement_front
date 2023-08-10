import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  showPassword: boolean = false;
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      this.email = rememberedEmail;
      this.password = rememberedPassword;
      this.rememberMe = true;
    }
  }

  onSignIn() {
    this.authService
      .login(this.email, this.password, this.rememberMe)
      .subscribe(
        (response) => {
          // Handle successful login here, e.g., redirect to another page
          console.log("Login successful", response);
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          // Handle login error here, e.g., display error message
          this.errorMessage = "Invalid email or password.";
          console.error("Login error", error);
        }
      );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
