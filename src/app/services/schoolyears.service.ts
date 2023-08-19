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
export class SchoolyearsService {
  schoolyears: any[] = [];
  private apiUrlSchoolYear = "school/years";

  constructor(private http: HttpClient) {}

  fetchSchoolYears() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/${this.apiUrlSchoolYear}`
    );
  }

  addSchoolYear(formData: any): Observable<any> {
    const schoolyear = {
      annee: formData.annee,
    };

    return this.http
      .post(`${environment.apiUrl}/${this.apiUrlSchoolYear}`, schoolyear)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "School year added successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error adding school year:", error);
          throw error;
        })
      );
  }

  updateSchoolYear(schoolyear: any): Observable<any> {
    const schoolyearId = schoolyear.id;

    return this.http
      .patch(
        `${environment.apiUrl}/${this.apiUrlSchoolYear}/${schoolyearId}`,
        schoolyear
      )
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "School year updated successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error updating school year:", error);
          throw error;
        })
      );
  }

  deleteSchoolYear(id: number): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this School Year?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the map operator to return the result of the HTTP delete request
          this.http
            .delete(`${environment.apiUrl}/${this.apiUrlSchoolYear}/${id}`)
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

  fetchSchoolYearByYear(annee: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${this.apiUrlSchoolYear}/${annee}`
    );
  }
}
