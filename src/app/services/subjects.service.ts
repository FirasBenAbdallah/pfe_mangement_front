import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SubjectsService {
  subjects: any[] = [];
  private apiUrlSubject = "subjects";

  constructor(private http: HttpClient) {}

  fetchSubjects() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.apiUrlSubject}`);
  }

  addSubject(formData: any): Observable<any> {
    const subject = {
      libelle: formData.libelle,
      competences: formData.competences,
      schoolyear_id: formData.schoolyear_id,
      user_id: formData.user_id,
    };

    return this.http
      .post(`${environment.apiUrl}/${this.apiUrlSubject}`, subject)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Subject added successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error adding subject:", error);
          throw error;
        })
      );
  }

  updateSubject(subject: any): Observable<any> {
    const subjectId = subject.id;

    return this.http
      .patch(
        `${environment.apiUrl}/${this.apiUrlSubject}/${subjectId}`,
        subject
      )
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Subject updated successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error updating subject:", error);
          throw error;
        })
      );
  }

  deleteSubject(id: number): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this subject?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the map operator to return the result of the HTTP delete request
          this.http
            .delete(`${environment.apiUrl}/${this.apiUrlSubject}/${id}`)
            .pipe(
              map((response) => {
                // Resolve the observer with the response data
                observer.next(response);
                observer.complete();
              })
            )
            .subscribe();
        } else {
          // If deletion was cancelled, throw an error
          observer.error(new Error("Deletion Cancelled"));
        }
      });
    });
  }
}
