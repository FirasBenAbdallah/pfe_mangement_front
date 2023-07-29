import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrlUser = "users";
  private apiUrl = `${environment.apiUrl}/${this.apiUrlUser}/login`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const formData = { email, password };
    return this.http.post<any>(this.apiUrl, formData);
  }
}
