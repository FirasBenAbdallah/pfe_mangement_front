import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

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
        // Handle successful login here, e.g., redirect to another page
        console.log("Login successful", response);
        this.router.navigate(["/dashboard"]);
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
  }

  preventBackNavigation(): void {
    this.location.subscribe(() => {
      this.location.forward();
    });
  }

  /* login(email: string, password: string, rememberMe: boolean) {
    const formData = { email, password };
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap((response) => {
        if (rememberMe) {
          // Store the login credentials in localStorage
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          // Clear any previously stored login credentials
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return true; // Replace this with your actual logic
  }

  logout(): void {
    this.router.navigateByUrl("/login");
  }

  preventBackNavigation(): void {
    this.location.subscribe(() => {
      this.location.forward();
    });
  } */
}
