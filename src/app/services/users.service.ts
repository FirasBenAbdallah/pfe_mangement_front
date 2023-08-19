import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private userDetails: any;
  users: any[] = [];
  private apiUrlUser = "users";

  constructor(private http: HttpClient) {}

  //  Fetch all users
  fetchUsers() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.apiUrlUser}`);
  }

  fetchEncadrantUsers() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/${this.apiUrlUser}/encadrants`
    );
  }

  // Add new user
  addUser(formData: any): Observable<any> {
    const user = {
      nom: formData.firstName,
      prenom: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    return this.http
      .post(`${environment.apiUrl}/${this.apiUrlUser}`, user)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "User added successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error adding user:", error);
          throw error;
        })
      );
  }

  // Update user by ID
  updateUser(user: any): Observable<any> {
    const userId = user.id;

    return this.http
      .patch(`${environment.apiUrl}/${this.apiUrlUser}/${userId}`, user)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "User updated successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error updating user:", error);
          throw error;
        })
      );
  }

  // Delete user by ID
  deleteUser(id: number): Observable<any> {
    return new Observable<any>((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          this.http
            .delete(`${environment.apiUrl}/${this.apiUrlUser}/${id}`)
            .subscribe(
              () => {
                observer.next(); // Notify the observer that deletion is successful
                observer.complete(); // Complete the observable
              },
              (error) => {
                observer.error(error); // Notify the observer if there's an error during deletion
              }
            );
        } else {
          observer.error(new Error("Deletion Cancelled")); // Notify the observer if deletion was cancelled
        }
      });
    });
  }

  fetchUserByPrenomAndNom(prenom: string, nom: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${this.apiUrlUser}/${prenom}/${nom}`
    );
  }

  setUserDetails(details: any) {
    this.userDetails = details;
  }

  getUserDetails() {
    return this.userDetails;
  }
}
