import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSignIn() {
    this.authService.login(this.email, this.password)
      .subscribe(
        response => {
          // Handle successful login here, e.g., redirect to another page
          console.log('Login successful', response);

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        error => {
          // Handle login error here, e.g., display error message
          this.errorMessage = 'Invalid email or password.';
          console.error('Login error', error);
        }
      );
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
