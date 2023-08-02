import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  users: any[] = [];
  private apiUrlUser = "users";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiUrlUser}`);
  }

  addUser(formData: any): Observable<any> {
    const user = {
      nom: formData.firstName,
      prenom: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlUser}`, user);
  }

  updateUser(user: any): Observable<any> {
    const userId = user.id; 

    return this.http.patch(`${this.apiUrl}/${this.apiUrlUser}/${userId}`, user);
  }

  deleteUser(id: number): Promise<any> {
    // Change the return type to Promise<any>
    return Swal.fire({
      // Return the Swal.fire as a Promise
      title: "Confirm Delete",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        return this.http
          .delete(`${this.apiUrl}/${this.apiUrlUser}/${id}`)
          .toPromise(); // Use toPromise() to convert Observable to Promise
      }
      throw new Error("Deletion Cancelled"); // Throw an error to indicate that deletion was cancelled
    });
  }
}
