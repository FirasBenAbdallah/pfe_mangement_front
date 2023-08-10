import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  subjects: any[] = [];
  private apiUrlSubject = "subjects";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchSubjects() {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiUrlSubject}`);
  }

  addSubject(formData: any): Observable<any> {
    const subject = {
      libelle: formData.libelle,
      competences: formData.competences,
      schoolyear_id: formData.schoolyear_id,
      user_id: formData.user_id,
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlSubject}`, subject );
  }

  updateSubject(subject: any): Observable<any> {
    const subjectId = subject.id;

    return this.http.patch(
      `${this.apiUrl}/${this.apiUrlSubject}/${subjectId}`,
      subject
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
            .delete(`${this.apiUrl}/${this.apiUrlSubject}/${id}`)
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
