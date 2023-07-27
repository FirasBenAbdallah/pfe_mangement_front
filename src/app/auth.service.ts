import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/user/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const formData = { email, password };
    return this.http.post<any>(this.apiUrl, formData);
  }
}
