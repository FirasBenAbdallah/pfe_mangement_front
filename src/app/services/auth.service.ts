import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrlUser = "users";
  private apiUrl = `${environment.apiUrl}/${this.apiUrlUser}/login`;
  private readonly STORAGE_KEY = "loginStatus";

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {
    // Check if the user is already logged in and redirect to dashboard if remembered
    const loginStatus = localStorage.getItem(this.STORAGE_KEY);
    if (loginStatus === "true") {
      this.router.navigate(["/dashboard"]);
    }
  }

  login(email: string, password: string, rememberMe: boolean) {
    const formData = { email, password };
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap((response) => {
        if (rememberMe) {
          localStorage.setItem(this.STORAGE_KEY, "true");
        }
        // Store user details in local storage or a service
        localStorage.setItem("userDetails", JSON.stringify(response.message));
        // Handle successful login here, e.g., redirect to another page
        this.router.navigate(["/dashboard"]);
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 3000, // Display for 3 seconds
        });
      }),
      catchError((error) => {
        // Handle login error here, e.g., display error message
        console.error("Login error", error);
        return throwError(error);
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === "true";
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigateByUrl("/login");
    // Display success message
    Swal.fire({
      icon: "error",
      title: "Logged out successfully",
      showConfirmButton: false,
      timer: 3000, // Display for 3 seconds
    });
  }

  preventBackNavigation(): void {
    this.location.subscribe(() => {
      this.location.forward();
    });
  }
}
